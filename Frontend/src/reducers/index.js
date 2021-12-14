import { combineReducers } from "redux";

import account from "./account/account";
import sprojects from "./account/sprojects";
import login from "./account/login";
import register from "./account/register";

import projects from "./projects/projects";
import project from "./projects/project";

import alerts from "./base/alerts";
import base from "./base/base";

import account_base from "./account/base";

export default combineReducers({
    account,
    sprojects,
    login,
    register,

    alerts,
    base,
    account_base,

    projects,
    project,
});
