import {APPBAR_TITLE_CHANGE} from "./actions";

const initialState = {
    title: 'Select component to show'
};

export default function appBarReducer(state = initialState, action) {
    switch (action.type) {
        case APPBAR_TITLE_CHANGE:
            return {...state, title: action.payload};
        default:
            return state;
    }
};
