import {
    LINK_PACK_ADD, LINK_PACK_COPY, LINK_PACK_DIALOG_OPEN_TOGGLE, LINK_PACK_EDIT,
    LINK_PACK_STATE_CHANGE
} from "./actions";

export const ruClusterURL = 'https://ktsrv.com/mrIWeb/mrIWeb.dll';

const linkPackDialogState = {
    ruCluster: true,
    shuffleParams: true,
    baseURL: ruClusterURL,
    panel: 'GEN25',
    linkAmount: 50000,
    startPID: 1,
    extraParams: '',
    PIDTemplate: '{pid}',

    open: false,
    mode: null,
    id: null,

};

export default function linkPackDialogReducer(state = linkPackDialogState, action) {
    switch (action.type) {
        case LINK_PACK_DIALOG_OPEN_TOGGLE:
            return {
                ...state,
                open: !state.open
            };
        case LINK_PACK_STATE_CHANGE:
            return {
                ...state,
                ...action.payload
            };
        case LINK_PACK_ADD:
            return {
                ...linkPackDialogState,
                open: true,
                mode: 'ADD'
            };
        case LINK_PACK_EDIT:
            return {
                ruCluster: action.payload.newState.base_url === ruClusterURL,
                shuffleParams: action.payload.newState.make_shuffle,
                baseURL: action.payload.newState.base_url,
                panel: action.payload.newState.panel,
                linkAmount: action.payload.newState.link_amount,
                startPID: action.payload.newState.pid_start_with,
                extraParams: action.payload.newState.extra_params,
                PIDTemplate: action.payload.newState.link_template,
                id: action.payload.newState.id,

                open: true,
                mode: 'EDIT'
            };
        case LINK_PACK_COPY:
            return {
                ruCluster: action.payload.newState.base_url === ruClusterURL,
                shuffleParams: action.payload.newState.make_shuffle,
                baseURL: action.payload.newState.base_url,
                panel: action.payload.newState.panel,
                linkAmount: action.payload.newState.link_amount,
                startPID: action.payload.newState.pid_start_with,
                extraParams: action.payload.newState.extra_params,
                PIDTemplate: action.payload.newState.link_template,
                id: action.payload.newState.id,

                open: true,
                mode: 'COPY'
            };
        default:
            return state;
    }
};
