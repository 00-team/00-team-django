import {
    LOGIN_LOADING,
    NEED_CODE,
    SUCCESS_VERIFY,
} from '../actions/types';


const initialState = {
    loading: false,
    needCode: false,
    email: null,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case NEED_CODE:
            return {
                ...state,
                needCode: true,
                email: action.payload,
            };
        case SUCCESS_VERIFY:
            return {
                ...state,
                needCode: false,
                email: null,
            };
        default:
            return state;
    }
}