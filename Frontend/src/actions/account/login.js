import axios from 'axios';
import {
    LOGIN_LOADING,
} from './types';

import {
    SUCCESS_ALERT,
    ERROR_ALERT,
    INFO_ALERT,
} from '../base/types'

import { getUser } from './account'
import Cookies from 'js-cookie';

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.currentScript.getAttribute('csrfToken') || Cookies.get('csrftoken')
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
            localStorage.username = username;
            localStorage.password = password;
            dispatch(getUser());
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


