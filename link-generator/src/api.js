import Store from "./store/Store";
import logoutUser from "./authentication/logoutHandler";

export const API_PATH = module.hot? 'http://dubrovskiy:8000/api/linkgen/' : 'http://172.30.5.60/api/linkgen/';
// export const API_PATH = 'http://dubrovskiy:8000/linkgen/';

export const TOKEN_LOCAL_KEY = 'jwt';

export const customFetch = async (location, config={}) => {
    const defaultConfig = {
        method: 'GET',
        headers: {'Authorization': `JWT ${localStorage.getItem(TOKEN_LOCAL_KEY)}`}
    };
    let newConfig = {...defaultConfig, ...config, headers: {...defaultConfig.headers, ...config.headers}};
    console.log('FETCH CONFIG', newConfig);
    let response = await fetch(API_PATH + location, newConfig);
    if (response.status === 401) {
        Store.dispatch(logoutUser());
        throw new Error(response.message);
        // return
    }
    return response;
};