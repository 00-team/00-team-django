import {
    INFO_ALERT,
    ERROR_ALERT,
    SUCCESS_ALERT,
} from '../../actions/base/types';

const initialState = {
    info: null,
    error: null,
    success: null,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case INFO_ALERT:
            return {
                ...state,
                info: action.payload,
            };
        case ERROR_ALERT:
            return {
                ...state,
                error: action.payload,
            };
        case SUCCESS_ALERT:
            return {
                ...state,
                success: action.payload,
            };
        default:
            return state;
    }
}