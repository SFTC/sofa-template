import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import createSagaMiddleware from 'redux-saga';
import reduxSofaSaga from 'redux-sofa-saga';
import { notification } from 'antd';

import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

export default function storeFactory(initialState = {}) {
  const middlewares = [sagaMiddleware, reduxSofaSaga({
    notification,
  })];

  const enhancers = [applyMiddleware(...middlewares)];

  // 在开发模式启用redux devtool
  const composeEnhancers = process.env.NODE_ENV !== 'production'
    && typeof window === 'object'
    // eslint-disable-next-line
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    // eslint-disable-next-line
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ shouldHotReload: false })
    : compose;

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers),
  );

  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  return store;
}
