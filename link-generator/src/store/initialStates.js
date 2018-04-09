import {TOKEN_LOCAL_KEY} from "../api";

export const projectState = {
    list: [],
    selectedProject: null
};

export const linkGroupsState = {
    list: [],
    selectedGroup: null
};

export const linksState = {
    list: [],
};

export const authenticationState = {
    isFetching: false,
    isAuthenticated: !!localStorage.getItem(TOKEN_LOCAL_KEY),
    usernameError: '',
    passwordError: '',
    errorMessage: '',
    // isAuthenticated: false
};