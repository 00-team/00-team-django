import {
    ANONYMOUS_USER,
    USER_LOADED,
    USER_LOADING,
} from '../../actions/account/types';


const initialState = {
    anonymous: false,
    loading: false,
    user: null,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                loading: true,
            };
        case USER_LOADED:
            return {
                ...state,
                anonymous: false,
                user: {...state.user, ...action.payload},
                loading: false,
            };
        case ANONYMOUS_USER:
            return {
                ...state,
                anonymous: true,
                user: null,
                loading: false,
            }
        default:
            return state;
    }
}