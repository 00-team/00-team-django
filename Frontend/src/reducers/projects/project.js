import {
    GET_PROJECT,
    LOADING_PROJECT,
} from '../../actions/projects/types';

const initialState = {
    project: null,
    loading: false,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PROJECT:
            return {
                ...state,
                project: action.payload
            };
        case LOADING_PROJECT:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
}