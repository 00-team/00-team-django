import { combineReducers } from 'redux';
import account from './account';
import sprojects from './sprojects'
import alerts from './alerts'
import login from './login'

export default combineReducers({
    account,
    sprojects,
    alerts,
    login,
});