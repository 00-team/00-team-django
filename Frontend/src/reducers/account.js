import {
    ANONYMOUS_USER,
    AUTH_ERROR,
    USER_LOADED,
    USER_LOADING,
} from '../actions/types';


const initialState = {
    anonymous: false,
    userLoading: false,
    user: null,
    error: null,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                userLoading: true,
            };
        case USER_LOADED:
            return {
                ...state,
                anonymous: false,
                user: action.payload,
                userLoading: false,
                error: null,
            };
        case AUTH_ERROR:
            return {
                ...state,
                anonymous: true,
                user: null,
                userLoading: false,
                error: action.payload,
            };
        case ANONYMOUS_USER:
            return {
                ...state,
                anonymous: true,
                user: null,
                userLoading: false,
                error: null,
            }
        default:
            return state;
    }
}