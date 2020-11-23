import {
  call,
  put,
  takeLatest
} from 'redux-saga/effects';

import { Creators, Types } from '../reducers/repo';
import ConsolidatedService from '../../services/consolidatedService'

const {
  ADD_REPO
} = Types;

const {
  addRepoSuccess,
  addRepoError,
} = Creators;

export function* addRepo({ payload: repoName = "" }) {
  try {
    const api = new ConsolidatedService();
    const { data } = yield call(api.getRepoConsolidated, repoName);
    if (!data) return;
    yield put(addRepoSuccess({ repo: data }));
  } catch (e) {
    console.log(e);
    yield put(addRepoError(e));
  }
}

export default function* watcher() {
  yield takeLatest(ADD_REPO, addRepo);
}