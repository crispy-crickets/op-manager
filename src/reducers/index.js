import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import intl from './intl';
import organizer from './organizer';

export default combineReducers({
  user,
  runtime,
  intl,
  organizer
});
