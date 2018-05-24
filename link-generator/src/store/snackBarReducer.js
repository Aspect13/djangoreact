import {SNACKBAR_RESTORE, SNACKBAR_SHOW} from "./actions";

const snackBarInitialState = {
    action: null,
    message: null,
    open: false,
};

export default function snackBarReducer(state = snackBarInitialState, action) {
    switch (action.type) {
        case SNACKBAR_SHOW:
            return {...state, ...action.payload};
        case SNACKBAR_RESTORE:
            return snackBarInitialState;

        default:
            return state;
    }
};
