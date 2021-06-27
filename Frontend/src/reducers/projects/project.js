import {
    GET_PROJECT,
    LOADING_PROJECT,
} from '../../actions/projects/types';

import {
    GET_PROJECT_STARS,
} from '../../actions/account/types';

const initialState = {
    project: null,
    loading: false,
    projectStars: {count: 0, selfStar: false},
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
        case GET_PROJECT_STARS:
            return {
                ...state,
                projectStars: {count: action.payload.count, selfStar: action.payload.self_star}
            }
        default:
            return state;
    }
}