import { combineReducers } from 'redux';
import account from './account';
import sprojects from './sprojects'
import alerts from './alerts'

export default combineReducers({
    account,
    sprojects,
    alerts,
});