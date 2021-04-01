import { createStore, applyMiddleware, compose } from "redux";
import RootReducer from './RootReducer';
import { logger } from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  RootReducer,
  composeEnhancers(applyMiddleware(logger))
);

export default store;