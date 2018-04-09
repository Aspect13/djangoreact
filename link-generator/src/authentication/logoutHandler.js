// Three possible states for our logout process as well.
// Since we are using JWTs, we just need to remove the token
// from localStorage. These actions are more useful if we
// were calling the API to log the user out


import {LOGOUT_REQUEST, LOGOUT_SUCCESS} from "../store/actions";
import {TOKEN_LOCAL_KEY} from "../api";

const requestLogout = () => {
    return {
        type: LOGOUT_REQUEST
    }
};

const receiveLogout = () => {
    return {
        type: LOGOUT_SUCCESS,
    }
};

// Logs the user out
const logoutUser = () => {
    return dispatch => {
        dispatch(requestLogout());
        localStorage.removeItem(TOKEN_LOCAL_KEY);
        // localStorage.removeItem('access_token');
        dispatch(receiveLogout());
    }
};

export default logoutUser;