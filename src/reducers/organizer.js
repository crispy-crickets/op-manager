import {
  ADD_MODULE_START,
  ADD_MODULE_SUCCESS,
  ADD_MODULE_ERROR,
  UPDATE_MODULE_START,
  UPDATE_MODULE_SUCCESS,
  UPDATE_MODULE_ERROR,
  DELETE_MODULE_START,
  DELETE_MODULE_SUCCESS,
  DELETE_MODULE_ERROR,
  ADD_RECO_START,
  ADD_RECO_SUCCESS,
  ADD_RECO_ERROR,
  UPDATE_RECO_START,
  UPDATE_RECO_SUCCESS,
  UPDATE_RECO_ERROR,
  DELETE_RECO_START,
  DELETE_RECO_SUCCESS,
  DELETE_RECO_ERROR,
  CREATE_LOG_START,
  CREATE_LOG_SUCCESS,
  CREATE_LOG_ERROR,
  UPDATE_LOG_START,
  UPDATE_LOG_SUCCESS,
  UPDATE_LOG_ERROR,
  DELETE_LOG_START,
  DELETE_LOG_SUCCESS,
  DELETE_LOG_ERROR,
  GET_MODULES_START,
  GET_MODULES_SUCCESS,
  GET_MODULES_ERROR,
  GET_LOGS_START,
  GET_LOGS_SUCCESS,
  GET_LOGS_ERROR,
  GET_RECO_START,
  GET_RECO_SUCCESS,
  GET_RECO_ERROR,
  SET_VALUE,
} from '../constants';

export default function organizer(state = null, action) {
  console.log('org red', state, action);
  if (state === null) {
    return {
      workPlanFeed: true,
      workPlanWater: true,
      workPlanTraysIn: true,
      workPlanTraysOut: true,
      workPlanHarvest: true,
      newLogEntryType: 'pinheads',
      newLogEntryTitle: 'Added pinheads',
      newLogEntryValue: '10',
    };
  }

  switch (action.type) {
    case SET_VALUE: {
      const newState = { ...state };
      newState[action.payload.name] = action.payload.value;
      return newState;
    }

    case DELETE_MODULE_START: {
      return {
        ...state,
        deletedModule: null,
        deletingModule: action.payload,
      };
    }

    case DELETE_MODULE_SUCCESS: {
      return {
        ...state,
        deletingModule: null,
        deletedModule: action.payload,
      };
    }

    case DELETE_MODULE_ERROR: {
      return {
        ...state,
        deletingModule: null,
        deletedModule: null,
      };
    }

    case UPDATE_MODULE_START: {
      return {
        ...state,
        moduleValues: action.payload.module,
      };
    }

    case UPDATE_MODULE_SUCCESS: {
      return {
        ...state,
        updatedModule: action.payload.module,
        addRow: false,
        addRowNumber: 1,
        addRowModuleSide: 'right',
      };
    }

    case UPDATE_MODULE_ERROR: {
      return {
        ...state,
        updatedModule: null,
      };
    }

    case ADD_MODULE_START: {
      return {
        ...state,
        newModule: action.payload.module,
      };
    }

    case ADD_MODULE_SUCCESS: {
      return {
        ...state,
        module: action.payload.module,
        newModuleName: '',
        newModule: null,
      };
    }

    case ADD_MODULE_ERROR: {
      return {
        ...state,
        newModule: null,
      };
    }

    case DELETE_RECO_START: {
      return {
        ...state,
        deletedReco: null,
        deletingReco: action.payload,
      };
    }

    case DELETE_RECO_SUCCESS: {
      return {
        ...state,
        deletingReco: null,
        deletedReco: action.payload,
      };
    }

    case DELETE_RECO_ERROR: {
      return {
        ...state,
        deletingReco: null,
        deletedReco: null,
      };
    }

    case UPDATE_RECO_START: {
      return {
        ...state,
        recoValues: action.payload.reco,
      };
    }

    case UPDATE_RECO_SUCCESS: {
      return {
        ...state,
        updatedReco: action.payload.reco,
      };
    }

    case UPDATE_RECO_ERROR: {
      return {
        ...state,
        updatedReco: null,
      };
    }

    case ADD_RECO_START: {
      return {
        ...state,
        newReco: action.payload.reco,
      };
    }

    case ADD_RECO_SUCCESS: {
      return {
        ...state,
        createdReco: action.payload.reco,
        newRecoName: '',
        newReco: null,
      };
    }

    case ADD_RECO_ERROR: {
      return {
        ...state,
        newReco: null,
      };
    }

    case DELETE_LOG_START: {
      return {
        ...state,
        deletedLogEntry: null,
        deletingLogEntry: action.payload,
      };
    }

    case DELETE_LOG_SUCCESS: {
      return {
        ...state,
        deletingLogEntry: null,
        deletedLogEntry: action.payload,
        manualLogEntry: false
      };
    }

    case DELETE_LOG_ERROR: {
      return {
        ...state,
        deletingLogEntry: null,
        deletedLogEntry: null,
      };
    }

    case UPDATE_LOG_START: {
      return {
        ...state,
        logEntryValues: action.payload.logEntry,
      };
    }

    case UPDATE_LOG_SUCCESS: {
      return {
        ...state,
        updatedLogEntry: action.payload.logEntry,
      };
    }

    case UPDATE_LOG_ERROR: {
      return {
        ...state,
        updatedLogEntry: null,
      };
    }

    case CREATE_LOG_START: {
      return {
        ...state,
        newReco: action.payload.logEntry,
      };
    }

    case CREATE_LOG_SUCCESS: {
      console.log('create log success', action.payload);
      const { type } = action.payload.logEntry;
      const nextTypes = {
        pinheads: ['water', 'Added water'],
        water: ['feed', 'Added feed'],
        feed: ['water', 'Added water'],
        'egg-tray-in': ['egg-tray-out', 'Removed egg trays'],
        'egg-tray-out': ['egg-tray-in', 'Placed egg trays'],
        'state-change': ['state-change', 'Changed state'],
      };
      return {
        ...state,
        createdLogEntry: action.payload.logEntry,
        newLogEntryText: '',
        newLogEntryValue: '',
        newLogEntryType: nextTypes[type][0],
        newLogEntryTitle: nextTypes[type][1],
        newLogEntry: null,
        manualLogEntry: false
      };
    }

    case CREATE_LOG_ERROR: {
      return {
        ...state,
        newLogEntry: null,
      };
    }

    case GET_LOGS_START: {
      return {
        ...state,
        loadingLogEntries: true,
      };
    }

    case GET_LOGS_SUCCESS: {
      const { logEntries } = action.payload;

      let defaultValues = {};

      if (logEntries && logEntries.length > 0) {
        console.log('loaded log entries: ', action.payload.logEntries.length);

        const { type } = logEntries[0];
        if (type === 'egg-tray-in') {
          defaultValues = {
            newLogEntryValue: '2',
            newLogEntryType: 'egg-tray-out',
            newLogEntryTitle: 'Removed egg trays',
          };
        } else if (type === 'egg-tray-out') {
          defaultValues = {
            newLogEntryValue: '2',
            newLogEntryType: 'egg-tray-in',
            newLogEntryTitle: 'Placed egg trays',
          };
        } else if (type === 'water') {
          defaultValues = {
            newLogEntryValue: '10',
            newLogEntryType: 'feed',
            newLogEntryTitle: 'Added feed',
          };
        } else if (type === 'feed') {
          defaultValues = {
            newLogEntryValue: '10',
            newLogEntryType: 'water',
            newLogEntryTitle: 'Added water',
          };
        }
      }

      return {
        ...state,
        ...defaultValues,
        loadingLogEntries: false,
        logEntries: action.payload.logEntries,
      };
    }

    case GET_LOGS_ERROR: {
      return {
        ...state,
        loadingLogEntries: false,
        logEntries: null,
      };
    }

    case GET_RECO_START: {
      return {
        ...state,
        loadingReco: true,
      };
    }

    case GET_RECO_SUCCESS: {
      return {
        ...state,
        loadingReco: false,
        reco: action.payload.reco,
        blockedAction: null
      };
    }

    case GET_RECO_ERROR: {
      return {
        ...state,
        loadingReco: false,
        reco: null,
      };
    }

    case GET_MODULES_START: {
      return {
        ...state,
        loadingModules: true,
      };
    }

    case GET_MODULES_SUCCESS: {
      // console.log("loaded modules: ", action.payload.modules.length);
      return {
        ...state,
        loadingModules: false,
        modules: action.payload.modules,
      };
    }

    case GET_MODULES_ERROR: {
      return {
        ...state,
        loadingModules: false,
        modules: action.payload.modules,
      };
    }

    default: {
      return state;
    }
  }
}
