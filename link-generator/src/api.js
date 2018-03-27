import Store from "./store/Store";
import logoutUser from "./authentication/logoutHandler";

export const API_PATH = 'http://localhost:8000/linkgen/';

export const customFetch = async (location, config={}) => {
    const defaultConfig = {
        method: 'GET',
        headers: {'Authorization': `JWT ${localStorage.getItem('id_token')}`}
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