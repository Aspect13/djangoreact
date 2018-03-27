import {applyMiddleware, combineReducers, createStore} from 'redux';

import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import projectReducer from "./projectReducer";
import groupReducer from "./groupReducer";
import linkReducer from "./linkReducer";

import {routerMiddleware, routerReducer} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import authenticationReducer from "./authenticationReducer";

export const history = createHistory();
const historyMiddleware = routerMiddleware(history);
const loggerMiddleware = createLogger();


let middlewares = (hotReload) => {
    const middlewareDebug = [thunk, loggerMiddleware, historyMiddleware];
    const middlewareLive = [thunk, historyMiddleware];

    if (hotReload) {
        return composeWithDevTools(applyMiddleware(...middlewareDebug))
    } else {
        return applyMiddleware(...middlewareLive);
    }
};


const Store = createStore(
    combineReducers({
        projectReducer, groupReducer, linkReducer, routerReducer, authenticationReducer
    }),
    middlewares(module.hot)
    // composeWithDevTools(applyMiddleware(thunk, loggerMiddleware, historyMiddleware))
);

export default Store;