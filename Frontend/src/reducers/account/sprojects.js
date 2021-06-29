import {
    SPROJECTS_LOADED,
    SPROJECTS_LOADING,

    ADD_SPROJECTS,
    REMOVE_SPROJECTS,

    GET_PROJECT_STARS,
} from '../../actions/account/types';


const initialState = {
    sprojects: [],
    loading: false,
    projectStars: {count: 0, selfStar: false},
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
        case GET_PROJECT_STARS:
            return {
                ...state,
                projectStars: {count: action.payload.count, selfStar: action.payload.self_star}
            }
        default:
            return state
    }
}