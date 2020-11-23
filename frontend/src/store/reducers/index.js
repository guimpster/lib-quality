import { combineReducers } from 'redux';

import RepoReducer from './repo';


const Reducers = combineReducers({
  repoState: RepoReducer
});

export default Reducers;
