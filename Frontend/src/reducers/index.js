import { combineReducers } from 'redux';

import account from './account/account';
import sprojects from './account/sprojects'
import login from './account/login'
import register from './account/register'

import projects from './projects/projects'

import alerts from './alerts'


export default combineReducers({
    account,
    sprojects,
    login,
    register,

    alerts,

    projects,
});