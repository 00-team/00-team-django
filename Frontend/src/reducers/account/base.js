import { SET_CSRFTOKEN } from "../../actions/account/types";

const initialState = {
    CSRF_TOKEN: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CSRFTOKEN:
            return {
                ...state,
                CSRF_TOKEN: action.payload,
            };

        default:
            return state;
    }
}
