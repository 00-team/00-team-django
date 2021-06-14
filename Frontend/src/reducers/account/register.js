import {
    REGISTER_ERROR,
    REGISTER_NEED_CODE,
    // REGISTER_SUCCESS,
    // VERIFY_CODE_ERROR,
    REGISTER_LOADING,
} from '../../actions/account/types';


const initialState = {
    needCode: false,
    loading: false,
    error: null,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case REGISTER_LOADING:
            return {
                ...state,
                loading: action.payload,
                error: null,
            };
        case REGISTER_NEED_CODE:
            return {
                ...state,
                needCode: action.payload,
                error: null,
            };
        case REGISTER_ERROR:
            return {
                ...state,
                error: action.payload,
            }
        default:
            return state;
    }
}