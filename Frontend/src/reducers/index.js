import { combineReducers } from 'redux';
import account from './account';
import sprojects from './sprojects'

export default combineReducers({
    account,
    sprojects,
});