import axios from "axios";
import { LOGIN_LOADING } from "./types";

import { SUCCESS_ALERT, ERROR_ALERT, INFO_ALERT } from "../base/types";

import { getUser } from "./account";
import Cookies from "js-cookie";
// import { getCSRFTOKEN } from "./base";

const getConfig = () => {
    return {
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken":
                Cookies.get("csrftoken") ||
                document.currentScript.getAttribute("csrfToken"),
        },
    };
};
export const login = (username, password) => (dispatch, getState) => {
    dispatch({ type: LOGIN_LOADING, payload: true });

    axios
        .post(
            "/api/account/login/",
            {
                username: username,
                password: password,
            },
            getConfig()
        )
        .then((res) => {
            if (res.data.status === "success") {
                localStorage.username = username;
                localStorage.password = password;
                dispatch(getUser());
            }
        })
        .catch((error) => {
            let msg = "Error to login";

            if (error.response)
                msg = error.response.data.error || "Error to login";
            else if (error.message) msg = error.message;

            dispatch({
                type: ERROR_ALERT,
                payload: msg,
            });
        })
        .then(() => dispatch({ type: LOGIN_LOADING, payload: false }));
};
