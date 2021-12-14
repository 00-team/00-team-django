import Cookies from "js-cookie";

import { SET_CSRFTOKEN } from "./types";

export const getCSRFTOKEN = () => (dispatch) => {
    const csrftoken =
        Cookies.get("csrftoken") ||
        document.currentScript.getAttribute("csrfToken");
    dispatch({ type: SET_CSRFTOKEN, payload: csrftoken });
};
