import { combineReducers } from 'redux';
import countReducer from './countReducer.js';
import badgeCountReducer from './badgeCountReducer.js';
const allReducers = combineReducers({
  count: countReducer,
  badgeCount: badgeCountReducer,
});
export default allReducers;