import { Module, Reco, LogEntry } from 'data/models';
import Sequelize, { Op } from 'sequelize';

export const schema = [
  `
  # A grow module object
  type Module {
    id: String
    name: String
    size: Int
    rowsRight: Int
    rowsLeft: Int
    recos: [Reco]
  }
`,
];

export const queries = [
  `
  # Retrieves all grow modules
  getAllModules: [Module]

  # Retrieves a single user from the local database
  getModule(
    # The user's email address
    id: String!
  ): Module
  
  getReco(
    # The user's email address
    id: String!
  ): Reco
`,
];

const daysFrom = date => {
  const now = new Date();
  // console.log("DAYS FROM", date, now.getTime());
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
};

const getEggState = async reco => {
  const logEntries = await LogEntry.findAll({
    where: {
      recoId: reco.id,
      type: { [Op.in]: ['egg-tray-in', 'egg-tray-out'] },
    },
    order: [['createdAt', 'DESC']],
  });

  // console.log("EGG STATE ENTRIES", logEntries);
  if (logEntries.length > 0) {
    const eggState = {};
    const now = new Date();
    const created = new Date(logEntries[0].createdAt);
    if (
      !(
        now.getDate() === created.getDate() &&
        now.getMonth() === created.getMonth() &&
        now.getFullYear() === created.getFullYear()
      )
    ) {
      if (logEntries[0].type === 'egg-tray-in') {
        eggState.next = 'traysOut';
      } else {
        eggState.next = 'traysIn';
      }
    }

    // console.log("FIRST EGGS", logEntries[logEntries.length - 1].createdAt);
    eggState.state = 'laying';
    eggState.layingDays = daysFrom(
      new Date(logEntries[logEntries.length - 1].createdAt),
    );
    // console.log("LAY DAYS", eggState.layingDays);

    return eggState;
  }

  return {};
};

const requiresWater = async reco => {
  const logEntries = await LogEntry.findAll({
    where: { recoId: reco.id, type: 'water' },
    order: [['createdAt', 'DESC']],
  });

  const threshold = 3;
  if (
    logEntries.length === 0 ||
    daysFrom(new Date(logEntries[0].createdAt)) > threshold
  ) {
    return true;
  }

  return false;
};

const requiresFeed = async reco => {
  const logEntries = await LogEntry.findAll({
    where: { recoId: reco.id, type: 'feed' },
    order: [['createdAt', 'DESC']],
  });

  const threshold = 3;
  if (
    logEntries.length === 0 ||
    daysFrom(new Date(logEntries[0].createdAt)) > threshold
  ) {
    return true;
  }

  return false;
};

const getLifeStats = async reco => {
  const logEntries = await LogEntry.findAll({
    where: { recoId: reco.id, type: 'pinheads' },
    order: [['createdAt', 'DESC']],
  });

  if (logEntries.length > 0) {
    const firstPinheads = logEntries[logEntries.length - 1].createdAt;
    const lifeDays = daysFrom(
      new Date(logEntries[logEntries.length - 1].createdAt),
    );
    let pinheads = 0;
    for (let i = 0; i < logEntries.length; i++) {
      pinheads += logEntries[i].numValue;
    }

    return {
      firstPinheads,
      lifeDays,
      pinheads,
    };
  }
  return {
    lifeDays: 0,
    pinheads: 0,
  };
};

const completeReco = async reco => {
  const eggState = await getEggState(reco);
  const lifeStats = await getLifeStats(reco);

  let state = 'empty';
  if (lifeStats.firstPinheads) {
    state = 'growing';
    if (eggState.state === 'laying') {
      state = 'laying';
    }
  }

  const { layingDays } = eggState;

  const water = await requiresWater(reco);
  const feed = await requiresFeed(reco);

  let requiredActions = [];
  if (feed) requiredActions.push('feed');
  if (water) requiredActions.push('water');
  if (eggState.next) requiredActions.push(eggState.next);
  if (state === 'empty') requiredActions.push('pinheads');
  if (state.laying && lifeStats.lifeDays > 56) {
    requiredActions.push('harvest');
  }

  requiredActions = requiredActions.join(',');

  // console.log("LIFE AND LAY DAYS", lifeDays, layingDays);
  return {
    ...reco.toJSON(),
    state: reco.state === 'harvested' ? 'harvested' : state,
    firstPinheads: lifeStats.firstPinheads,
    pinheads: lifeStats.pinheads,
    lifeDays: Math.floor(lifeStats.lifeDays),
    layingDays: Math.floor(layingDays),
    requiredActions,
  };
};

export const resolvers = {
  RootQuery: {
    async getAllModules() {
      const modules = await Module.findAll({
        include: [{ model: Reco, as: 'recos', where: { state: { [Op.in]: ['empty', 'growing', 'laying' ] } } }],
      });

      for (let i = 0; i < modules.length; i++) {
        const recos = [];
        for (let j = 0; j < (modules[i].recos || []).length; j++) {
          recos.push(completeReco(modules[i].recos[j]));
        }
        modules[i].recos = recos;
      }

      return modules;
    },

    getModule(parent, { id }) {
      return {
        id: '1',
        name: 'Module 1',
      };
    },

    async getReco(parent, { id }) {
      let reco = await Reco.findById(id);
      reco = await completeReco(reco);

      const logEntries = await LogEntry.findAll({
        where: { recoId: id },
        order: [['createdAt', 'DESC']],
      });
      return {
        ...reco,
        logEntries: logEntries.map(logEntry => logEntry.toJSON()),
      };
    },
  },
};
