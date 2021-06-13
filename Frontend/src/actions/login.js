import axios from 'axios';
import {
    LOGIN_LOADING,
    NEED_CODE,
    SUCCESS_VERIFY,
    ERROR_ALERT,
} from './types';

import { getUser } from './account'

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.currentScript.getAttribute('csrfToken') || ''
    },
};


export const login = (username, password) => (dispatch) => {
    dispatch({ type: LOGIN_LOADING, payload: true });

    axios.post('/api/account/login/', {
        username: username,
        password: password,
    }, config)
    .then(res => {
        if (res.data.status === 'success') {
            dispatch(getUser());
            localStorage.username = username;
            localStorage.password = password;
        }
    })
    .catch(error => {
        let msg = 'Error to login'

        if (error.response) msg = error.response.data.error || 'Error to login';
        else if (error.message) msg = error.message;

        dispatch({
            type: ERROR_ALERT,
            payload: msg
        })
    })
    .then(() => dispatch({ type: LOGIN_LOADING, payload: false }))
}


export const register = (email, username, password) => (dispatch) => {
    dispatch({ type: LOGIN_LOADING, payload: true });

    axios.post('/api/account/register/', {
        email: email,
        username: username,
        password: password,
    }, config)
    .then(res => {
        dispatch({
            type: NEED_CODE,
            payload: email,
        })
    })
    .catch(error => {
        let msg = 'Error to Register'

        if (error.response) msg = error.response.data.error || 'Error to Register';
        else if (error.message) msg = error.message;

        dispatch({
            type: ERROR_ALERT,
            payload: msg
        })
    })
    .then(() => dispatch({ type: LOGIN_LOADING, payload: false }))
}


export const verifyCode = (email, code) => (dispatch) => {
    dispatch({ type: LOGIN_LOADING, payload: true });

    axios.post('/api/account/verify_code/', {
        email: email,
        code: code,
    }, config)
    .then(res => {
        dispatch({
            type: SUCCESS_VERIFY,
        });
        dispatch(getUser());
        localStorage.email = email;
    })
    .catch(error => {
        let msg = 'Error to Verify Code'

        if (error.response) msg = error.response.data.error || 'Error to Verify Code';
        else if (error.message) msg = error.message;

        dispatch({
            type: ERROR_ALERT,
            payload: msg
        })
    })
    .then(() => dispatch({ type: LOGIN_LOADING, payload: false }))
}