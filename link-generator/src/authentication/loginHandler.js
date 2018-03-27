// There are three possible states for our login
// process and we need actions for each of them
import {LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS} from "../store/actions";
import {API_PATH} from "../api";


const requestLogin = creds => {
    return {
        type: LOGIN_REQUEST,
        payload: creds
    }
};

const receiveLogin = user => {
    return {
        type: LOGIN_SUCCESS
    }
};

const loginError = obj => {
    return {
        type: LOGIN_FAILURE,
        payload: obj
    }
};

export const errorToJSON = err => {
    if (err instanceof Error) {
        return {[err.stack]: err.message};
    }
    return err
};

// Calls the API to get a token and
// dispatches actions along the way
const loginUser = creds => {

    // let config = {
    //     method: 'POST',
    //     headers: { 'Content-Type':'application/x-www-form-urlencoded' },
    //     body: `username=${creds.username}&password=${creds.password}`
    // };

    let config = {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(creds)
    };
    console.log('login conf', config);
    return dispatch => {
        // We dispatch requestLogin to kickoff the call to the API
        dispatch(requestLogin(creds));

        return fetch(API_PATH + 'api-token-auth/', config)
            .then(response =>
                response.json().then(user => ({ user, response }))
            ).then(({ user, response }) =>  {
                if (!response.ok) {
                    // If there was a problem, we want to
                    // dispatch the error condition
                    dispatch(loginError(user));
                    return Promise.reject(user);
                } else {
                    // If login was successful, set the token in local storage
                    localStorage.setItem('id_token', user.token);
                    // localStorage.setItem('access_token', user.access_token);
                    // Dispatch the success action
                    dispatch(receiveLogin(user));
                }
            }).catch(err => {
                console.log("Auth Error: ", err);
                // if (err instanceof Error) {
                //     dispatch(loginError({[err.stack]: err.message}));
                // } else {
                //     dispatch(loginError({...err}));
                // }
                    dispatch(loginError(errorToJSON(err)));
            })
    }
};
export default loginUser;
