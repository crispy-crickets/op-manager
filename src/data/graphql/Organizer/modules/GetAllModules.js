import { Module, Reco, LogEntry } from 'data/models';

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
`,

];

export const resolvers = {

  RootQuery: {

    async getAllModules() {

      const modules = await Module.findAll({
        include: [
          { model: Reco, as: 'recos', include: [ { model: LogEntry, as: 'logEntries' } ] }
        ]
      });

      for (let i = 0; i < modules.length; i++) {
        for (let j = 0; j < (modules[i].recos || []).length; j++) {
          const { logEntries } = modules[i].recos[j];
          if (logEntries && logEntries.length > 1) {
            modules[i].recos[j].actionAlert = 10;
          }
          if (logEntries && logEntries.length > 2) {
            modules[i].recos[j].infoAlert = 10;
          }
        }
      }

      return modules;

    },

    getModule(parent, { id }) {
      return {
        id: '1',
        name: 'Module 1'
      };
    },

  },
};
