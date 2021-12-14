import axios from "axios";
import {
    SPROJECTS_LOADING,
    SPROJECTS_LOADED,
    ADD_SPROJECTS,
    REMOVE_SPROJECTS,
    GET_PROJECT_STARS,
} from "./types";

import { SUCCESS_ALERT, ERROR_ALERT, INFO_ALERT } from "../base/types";

import Cookies from "js-cookie";
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

export const loadSprojects = () => (dispatch) => {
    dispatch({ type: SPROJECTS_LOADING });

    axios
        .get("/api/account/sprojects/")
        .then((res) => {
            if (res.status === 200 && res.data.stared_projects) {
                dispatch({
                    type: SPROJECTS_LOADED,
                    payload: res.data.stared_projects,
                });
            }
        })
        .catch((error) => {
            dispatch({
                type: ERROR_ALERT,
                payload: error.response
                    ? error.response.data.error ||
                      "Error to load stared projects"
                    : error.message,
            });
        });
};

export const toggleSproject = (projectId, callback) => (dispatch) => {
    dispatch({ type: SPROJECTS_LOADING });

    axios
        .post(
            "/api/projects/modify_star/",
            {
                project_id: projectId,
            },
            getConfig()
        )
        .then((res) => {
            if (res.status === 200) {
                if (res.data.action === "add") {
                    dispatch({
                        type: ADD_SPROJECTS,
                        payload: res.data.project,
                    });
                    dispatch({
                        type: SUCCESS_ALERT,
                        payload: "Successfully add a Stared Project",
                    });
                } else if (res.data.action === "remove") {
                    dispatch({
                        type: REMOVE_SPROJECTS,
                        payload: res.data.project_id,
                    });
                    dispatch({
                        type: SUCCESS_ALERT,
                        payload: "Successfully remove a Stared Project",
                    });
                }

                if (typeof callback === "function") {
                    callback();
                }
            } else if (res.status === 203) {
                dispatch({
                    type: INFO_ALERT,
                    payload: "Login first and then try again.",
                });
            }
        })
        .catch((error) => {
            dispatch({
                type: ERROR_ALERT,
                payload: error.response
                    ? error.response.data.error ||
                      "Cant add/remove star project"
                    : error.message,
            });
        });
};

export const getProjectStars = (projectId) => (dispatch) => {
    axios
        .post(
            "/api/projects/stars/",
            {
                project_id: projectId,
            },
            getConfig()
        )
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: GET_PROJECT_STARS,
                    payload: res.data.data,
                });
            }
        })
        .catch((error) => {
            dispatch({
                type: ERROR_ALERT,
                payload: error.response
                    ? error.response.data.error || "Cant project stars"
                    : error.message,
            });
        });
};
