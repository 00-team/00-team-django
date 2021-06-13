import {
    LOGIN_LOADING,
    
} from '../actions/types';


const initialState = {
    loading: false,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
}