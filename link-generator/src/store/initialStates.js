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
    isAuthenticated: !!localStorage.getItem('id_token'),
    usernameError: '',
    passwordError: '',
    errorMessage: '',
    // isAuthenticated: false
};