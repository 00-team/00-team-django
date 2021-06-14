import axios from 'axios'
import { getUser } from './account';

import {
    REGISTER_ERROR,
    REGISTER_NEED_CODE,
    REGISTER_SUCCESS,
    // VERIFY_CODE_ERROR,
    REGISTER_LOADING,
} from './types'

import {
    SUCCESS_ALERT,
    ERROR_ALERT,
    INFO_ALERT,
} from '../base/types'

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.currentScript.getAttribute('csrfToken') || ''
    },
};

export const register = (email, username, password) => (dispatch) => {
    dispatch({ type: REGISTER_LOADING, payload: true });

    axios.post('/api/account/register/', {
        email: email,
        username: username,
        password: password,
    }, config)
    .then(res => {
        if (res.data.success) {
            dispatch({
                type: REGISTER_NEED_CODE,
                payload: true,
            })
            dispatch({
                type: SUCCESS_ALERT,
                payload: res.data.success
            })
        } else {
            dispatch({
                type: ERROR_ALERT,
                payload: 'Error to Register'
            })
        }
    })
    .catch(error => {
        let msg = 'Error to Register'

        if (error.response) {
            if (error.response.status === 406) {
                return dispatch({
                    type: REGISTER_NEED_CODE,
                    payload: true,
                });
            }
            msg = error.response.data.error || 'Error to Register, reload page and test agein';

            dispatch({
                type: REGISTER_ERROR,
                payload: {msg: msg, field: error.response.data.field || 'all'}
            })
        }
        else if (error.message) msg = error.message;

        dispatch({
            type: ERROR_ALERT,
            payload: msg
        })
    })
    .then(() => dispatch({ type: REGISTER_LOADING, payload: false }))
}


export const verifyCode = (email, code) => (dispatch) => {
    dispatch({ type: REGISTER_LOADING, payload: true });

    axios.post('/api/account/verify_code/', {
        email: email,
        code: code,
    }, config)
    .then(res => {
        if (res.data.success) {
            dispatch({
                type: REGISTER_NEED_CODE,
                payload: false,
            })
            dispatch({
                type: REGISTER_ERROR,
                payload: null,
            })
            dispatch(getUser());
            localStorage.email = email;
        } else {
            dispatch({
                type: ERROR_ALERT,
                payload: 'Error to Verify Code'
            })
        }
    })
    .catch(error => {
        let msg = 'Error to Verify Code'

        if (error.response) {
            msg = error.response.data.error || 'Error to Verify Code';

            dispatch({
                type: REGISTER_ERROR,
                payload: {msg: msg, field: error.response.data.field || 'all'}
            })
        }
        else if (error.message) msg = error.message;

        dispatch({
            type: ERROR_ALERT,
            payload: msg
        })        
    })
    .then(() => dispatch({ type: REGISTER_LOADING, payload: false }))
}