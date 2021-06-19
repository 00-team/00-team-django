import {
    IS_MOBILE
} from '../../actions/base/types';

const initialState = {
    isMobile: false,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case IS_MOBILE:
            return {
                ...state,
                isMobile: action.payload || false,
            };
        default:
            return state;
    }
}