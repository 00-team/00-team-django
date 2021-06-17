import {
    GET_PROJECTS,
    LOADING_PROJECTS,
} from '../../actions/projects/types';

const initialState = {
    projects: [],
    loading: false,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PROJECTS:
            return {
                ...state,
                projects: action.payload
            };
        case LOADING_PROJECTS:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
}