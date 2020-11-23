import createSagaMiddleware from 'redux-saga';
import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';

import RootSaga from './sagas';
import Reducers from './reducers';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const Store = createStore(Reducers, composeEnhancers(applyMiddleware(sagaMiddleware)));

RootSaga.map((saga) => sagaMiddleware.run(saga));

export const action = (type, payload) => Store.dispatch({ type, payload });

export default Store;
