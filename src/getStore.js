import thunk from "redux-thunk";
import { Iterable } from "immutable";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "@redux-saga/core";
import { compose, createStore, applyMiddleware } from "redux";

import { getQuery } from "./utility";
import { initSagas } from "./initSagas";
import { reducer } from "./combineReducers";
import { defaultState } from "./defaultState";

const stateTransformer = state => {
  if (Iterable.isIterable(state)) {
    return state.toJS();
  }

  return state;
};

const logger = createLogger({
  stateTransformer,
});

export const getStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middleWares = [sagaMiddleware, thunk];

  if (getQuery()["logger"]) {
    middleWares.push(logger);
  }

  const composables = [applyMiddleware(...middleWares)];
  const enhancer = compose(...composables);
  const store = createStore(reducer, defaultState, enhancer);

  initSagas(sagaMiddleware);

  return store;
};
