import {
    // user auth
    ANONYMOUS_USER,
    AUTH_ERROR,
    USER_LOADED,
    USER_LOADING,

    // stared projects
    SPROJECTS_LOADED,
    SPROJECTS_ERROR,
    SPROJECTS_LOADING
} from '../actions/types';


const initialState = {
    // user
    anonymous: false,
    userLoading: false,
    user: null,
    error: null,

    // stared project
    sprojects: [],
    sprojectsError: null,
    sprojectsLoading: false,
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
        
        case SPROJECTS_LOADING:
            return {
                ...state,
                sprojects: [],
                sprojectsError: null,
                sprojectsLoading: true,
            }
        case SPROJECTS_LOADED:
                return {
                    ...state,
                    sprojects: action.payload,
                    sprojectsError: null,
                    sprojectsLoading: false,
                }
        case SPROJECTS_ERROR:
            return {
                ...state,
                sprojects: [],
                sprojectsError: action.payload,
                sprojectsLoading: false,
            }
        default:
            return state;
    }
}