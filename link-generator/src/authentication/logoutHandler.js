import {LOGOUT_REQUEST, LOGOUT_SUCCESS} from "../store/actions";
import {TOKEN_LOCAL_KEY} from "../api";

// const requestLogout = () => {
//     return {
//         type: LOGOUT_REQUEST
//     }
// };
//
// const receiveLogout = () => {
//     return {
//         type: LOGOUT_SUCCESS,
//     }
// };

// Logs the user out
const logoutUser = () => {
    return dispatch => {
        // dispatch(requestLogout());
        dispatch({type: LOGOUT_REQUEST});
        localStorage.removeItem(TOKEN_LOCAL_KEY);
        // localStorage.removeItem('access_token');
        // dispatch(receiveLogout());
        dispatch({type: LOGOUT_SUCCESS});
    }
};

export default logoutUser;