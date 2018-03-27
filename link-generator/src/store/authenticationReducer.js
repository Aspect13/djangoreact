import {authenticationState} from "./initialStates";
import {LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_REQUEST, LOGOUT_SUCCESS} from "./actions";

const errMsg = (errMsg) => {
    delete errMsg.username;
    delete errMsg.password;
    if (Object.keys(errMsg).length > 0) {
        return Object.values(errMsg)[0]
    }
    return null;
};

export default function authenticationReducer(state = authenticationState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: false,
                user: action.payload,
                errorMessage: null,
                usernameError: null,
                passwordError: null
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: true,
                errorMessage: null,
                usernameError: null,
                passwordError: null
            };
        case LOGIN_FAILURE:

            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                errorMessage: errMsg({...action.payload}),
                usernameError: action.payload.username,
                passwordError: action.payload.password,
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: true
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false
            };
        default:
            return state
    }
};

// // The quotes reducer
// function quotes(state = {}, action) {
//     switch (action.type) {
//
//         default:
//             return state
//     }
// }
