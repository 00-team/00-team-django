import {
    SPROJECTS_LOADED,
    SPROJECTS_LOADING,

    ADD_SPROJECTS,
    REMOVE_SPROJECTS,
} from '../actions/types';


const initialState = {
    sprojects: [],
    loading: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SPROJECTS_LOADING:
            return {
                ...state,
                loading: true,
            }
        case SPROJECTS_LOADED:
            return {
                ...state,
                sprojects: action.payload,
                loading: false,
            }
        case ADD_SPROJECTS:
            return {
                ...state,
                sprojects: [...state.sprojects, action.payload],
                loading: false,
            }
        case REMOVE_SPROJECTS:
            return {
                ...state,
                sprojects: state.sprojects.filter((p) => p.id !== action.payload),
                loading: false,
            }
        default:
            return state
    }
}