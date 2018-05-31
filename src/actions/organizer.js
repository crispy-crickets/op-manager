/* eslint-disable import/prefer-default-export */
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
  SET_VALUE
} from '../constants';

import mutationAddModule from '../data/graphql/queries/addModule.graphql';
import mutationUpdateModule from '../data/graphql/queries/updateModule.graphql';
import mutationDeleteModule from '../data/graphql/queries/deleteModule.graphql';
import mutationAddReco from '../data/graphql/queries/addReco.graphql';
import mutationUpdateReco from '../data/graphql/queries/updateReco.graphql';
import mutationDeleteReco from '../data/graphql/queries/deleteReco.graphql';
import mutationCreateLogEntry from '../data/graphql/queries/createLogEntry.graphql';
import mutationUpdateLogEntry from '../data/graphql/queries/updateLogEntry.graphql';
import mutationDeleteLogEntry from '../data/graphql/queries/deleteLogEntry.graphql';
import queryGetAllModules from '../data/graphql/queries/getModules.graphql';
import queryGetAllLogEntries from '../data/graphql/queries/getLogEntries.graphql';
import queryGetReco from '../data/graphql/queries/getReco.graphql';

const fetchReco = async (id, dispatch, client) => {

  console.log("get reco", id);
  dispatch({
    type: GET_RECO_START,
    payload: {
      id
    }
  });

  try {

    const { data } = await client.query({
      query: queryGetReco,
      variables: { id },
    });

    dispatch({
      type: GET_RECO_SUCCESS,
      payload: {
        reco: data.getReco,
      },
    });

    return data.getReco;

  } catch (error) {

    dispatch({
      type: GET_RECO_ERROR,
      payload: {
        error,
      },
    });

    return null;

  }

};

const fetchAllModules = async (dispatch, client) => {

  dispatch({
    type: GET_MODULES_START
  });

  try {

    const { data } = await client.query({
      query: queryGetAllModules,
      fetchPolicy: 'network-only'
    });

    dispatch({
      type: GET_MODULES_SUCCESS,
      payload: {
        modules: data.getAllModules,
      },
    });

    return data.getAllModules;

  } catch (error) {

    dispatch({
      type: GET_MODULES_ERROR,
      payload: {
        error
      },
    });

    return null;

  }

};

const fetchAllLogEntries = async (recoId, dispatch, client) => {

  dispatch({
    type: GET_LOGS_START
  });

  try {

    const { data } = await client.query({
      query: queryGetAllLogEntries,
      fetchPolicy: 'network-only',
      variables: { recoId },
    });

    dispatch({
      type: GET_LOGS_SUCCESS,
      payload: {
        logEntries: data.getAllLogEntries,
      },
    });

    return data.getAllLogEntries;

  } catch (error) {

    dispatch({
      type: GET_LOGS_ERROR,
      payload: {
        error
      },
    });

    return null;

  }

};


export function setValue(name, value) {

  return async (dispatch, getState, { client, history }) => {

    dispatch({
      type: SET_VALUE,
      payload: {
        name, value
      }
    });

    return { name, value };

  };

}

export function getAllModules() {

  return async (dispatch, getState, { client, history }) => {
    return fetchAllModules(dispatch, client);
  };

}

export function getAllLogEntries(recoId) {

  return async (dispatch, getState, { client, history }) => {
    return fetchAllLogEntries(recoId, dispatch, client);
  };

}

export function addModule({ module }) {

  return async (dispatch, getState, { client, history }) => {

    dispatch({
      type: ADD_MODULE_START,
      payload: {
        module
      }
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationAddModule,
        variables: { module },
      });

      dispatch({
        type: ADD_MODULE_SUCCESS,
        payload: {
          module: data.createModule,
        },
      });

      fetchAllModules(dispatch, client);

      return data.createModule;

    } catch (error) {

      dispatch({
        type: ADD_MODULE_ERROR,
        payload: {
          module,
          error,
        },
      });

      return null;

    }

  };

}

export function updateModule({ module }) {

  return async (dispatch, getState, { client, history }) => {

    console.log("update module", module);
    dispatch({
      type: UPDATE_MODULE_START,
      payload: {
        module
      }
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationUpdateModule,
        variables: { module },
      });

      dispatch({
        type: UPDATE_MODULE_SUCCESS,
        payload: {
          module: data.updateModule,
        },
      });

      fetchAllModules(dispatch, client);

      return data.updateModule;

    } catch (error) {

      dispatch({
        type: UPDATE_MODULE_ERROR,
        payload: {
          module,
          error,
        },
      });

      return null;

    }

  };

}

export function deleteModule(id) {

  return async (dispatch, getState, { client, history }) => {

    dispatch({
      type: DELETE_MODULE_START,
      payload: id
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationDeleteModule,
        variables: { id },
      });

      dispatch({
        type: DELETE_MODULE_SUCCESS,
        payload: data.deleteModule,
      });

      fetchAllModules(dispatch, client);

      return data.deleteModule;

    } catch (error) {

      dispatch({
        type: DELETE_MODULE_ERROR,
        payload: {
          id,
          error,
        },
      });

      return null;

    }

  };

}

export function addReco({ reco }) {

  return async (dispatch, getState, { client, history }) => {

    dispatch({
      type: ADD_RECO_START,
      payload: {
        reco
      }
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationAddReco,
        variables: { reco },
      });

      dispatch({
        type: ADD_RECO_SUCCESS,
        payload: {
          reco: data.createReco,
        },
      });

      fetchAllModules(dispatch, client);

      return data.createReco;

    } catch (error) {

      dispatch({
        type: ADD_RECO_ERROR,
        payload: {
          reco,
          error,
        },
      });

      return null;

    }

  };

}

export function updateReco({ reco }) {

  return async (dispatch, getState, { client, history }) => {

    console.log("update reco", reco);
    dispatch({
      type: UPDATE_RECO_START,
      payload: {
        reco
      }
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationUpdateReco,
        variables: { reco },
      });

      dispatch({
        type: UPDATE_RECO_SUCCESS,
        payload: {
          reco: data.updateReco,
        },
      });

      fetchAllModules(dispatch, client);

      return data.updateReco;

    } catch (error) {

      dispatch({
        type: UPDATE_RECO_ERROR,
        payload: {
          reco,
          error,
        },
      });

      return null;

    }

  };

}

export function deleteReco(id) {

  return async (dispatch, getState, { client, history }) => {

    dispatch({
      type: DELETE_RECO_START,
      payload: id
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationDeleteReco,
        variables: { id },
      });

      dispatch({
        type: DELETE_RECO_SUCCESS,
        payload: data.deleteReco,
      });

      fetchAllModules(dispatch, client);

      return data.deleteReco;

    } catch (error) {

      dispatch({
        type: DELETE_RECO_ERROR,
        payload: {
          id,
          error,
        },
      });

      return null;

    }

  };

}

export function createLogEntry({ logEntry }, recoUpdate) {

  return async (dispatch, getState, { client, history }) => {

    console.log("dispatching create log entry payload", logEntry);
    dispatch({
      type: CREATE_LOG_START,
      payload: {
        logEntry
      }
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationCreateLogEntry,
        variables: { logEntry },
      });

      dispatch({
        type: CREATE_LOG_SUCCESS,
        payload: {
          logEntry: data.createLogEntry,
        },
      });

      console.log("created log entry", data);
      fetchAllLogEntries(data.createLogEntry.recoId, dispatch, client);
      fetchAllModules(dispatch, client);

      setTimeout(() => {
        fetchReco(data.createLogEntry.recoId, dispatch, client);
      }, 2000);

      return data.createLogEntry;

    } catch (error) {

      dispatch({
        type: CREATE_LOG_ERROR,
        payload: {
          logEntry,
          error,
        },
      });

      return null;

    }

  };

}

export function updateLogEntry({ logEntry }) {

  return async (dispatch, getState, { client, history }) => {

    console.log("update log entry", logEntry);
    dispatch({
      type: UPDATE_LOG_START,
      payload: {
        logEntry
      }
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationUpdateLogEntry,
        variables: { logEntry },
      });

      dispatch({
        type: UPDATE_LOG_SUCCESS,
        payload: {
          logEntry: data.updateLogEntry,
        },
      });

      fetchAllModules(dispatch, client);

      return data.updateLogEntry;

    } catch (error) {

      dispatch({
        type: UPDATE_LOG_ERROR,
        payload: {
          logEntry,
          error,
        },
      });

      return null;

    }

  };

}

export function deleteLogEntry(id) {

  return async (dispatch, getState, { client, history }) => {

    dispatch({
      type: DELETE_LOG_START,
      payload: id
    });

    try {

      const { data } = await client.mutate({
        mutation: mutationDeleteLogEntry,
        variables: { id },
      });

      dispatch({
        type: DELETE_LOG_SUCCESS,
        payload: data.deleteLogEntry,
      });

      fetchAllLogEntries(data.deleteLogEntry.recoId, dispatch, client);
      fetchAllModules(dispatch, client);
      setTimeout(() => {
        fetchReco(data.deleteLogEntry.recoId, dispatch, client);
      }, 2000);

      return data.deleteLogEntry;

    } catch (error) {

      dispatch({
        type: DELETE_LOG_ERROR,
        payload: {
          id,
          error,
        },
      });

      return null;

    }

  };

}

export function getReco(id) {

  return async (dispatch, getState, { client, history }) => {
    return fetchReco(id, dispatch, client);
  };

}
