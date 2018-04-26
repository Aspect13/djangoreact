import {PASSWORD_CHANGE_FAILURE, PASSWORD_CHANGE_REQUEST, PASSWORD_CHANGE_SUCCESS} from "./actions";
import {errMsg} from "./authenticationReducer";
import {TOKEN_LOCAL_KEY} from "../api";

const changePasswordState = {
    isFetching: false,
    isAuthenticated: !!localStorage.getItem(TOKEN_LOCAL_KEY),
    usernameError: '',
    passwordError: '',
    errorMessage: '',
    // isAuthenticated: false
};

export default function changePasswordReducer (state = changePasswordState, action) {
    switch (action.type) {
        case PASSWORD_CHANGE_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: false,
                user: action.payload,
                errorMessage: null,
                usernameError: null,
                passwordError: null
            };
        case PASSWORD_CHANGE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: true,
                errorMessage: null,
                usernameError: null,
                passwordError: null
            };
        case PASSWORD_CHANGE_FAILURE:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                errorMessage: errMsg({...action.payload}),
                usernameError: action.payload.username,
                passwordError: action.payload.password,
            };
        default:
            return state
    }
};
