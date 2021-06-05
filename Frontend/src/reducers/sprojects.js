import {
    SPROJECTS_LOADED,
    SPROJECTS_ERROR,
    SPROJECTS_LOADING,

    ADD_SPROJECTS,
    REMOVE_SPROJECTS,
} from '../actions/types';


const initialState = {
    sprojects: [],
    error: null,
    loading: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SPROJECTS_LOADING:
            return {
                ...state,
                loading: action.payload,
            }
        case SPROJECTS_LOADED:
            return {
                ...state,
                sprojects: action.payload,
                error: null
            }
        case SPROJECTS_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case ADD_SPROJECTS:
            if (action.payload) {
                return {
                    ...state,
                    sprojects: [...state.sprojects, action.payload],
                    error: null,
                }
            }
        case REMOVE_SPROJECTS:
            return {
                ...state,
                sprojects: state.sprojects.filter((p) => p.id !== action.payload),
                error: null,
            }
        default:
            return state
    }
}