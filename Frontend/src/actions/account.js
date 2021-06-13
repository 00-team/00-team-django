import axios from 'axios';
import {
    ANONYMOUS_USER,
    USER_LOADED,
    USER_LOADING,

    SUCCESS_ALERT,
    ERROR_ALERT,
} from './types';

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.currentScript.getAttribute('csrfToken') || ''
    },
};

export const getUser = () => (dispatch) => {
    dispatch({ type: USER_LOADING });

    axios.get('/api/account/')
    .then(res => {
        if (res.status === 203) dispatch({ type: ANONYMOUS_USER });
        if (res.status === 200 && res.data.user) dispatch({ 
            type: USER_LOADED,
            payload: res.data.user,
        });
    })
    .catch(error => {
        let msg = 'Error get user informations'

        if (error.response) msg = error.response.data.error;
        else if (error.message) msg = error.message;

        dispatch({
            type: ERROR_ALERT,
            payload: msg
        })
    })
}


export const changeInfo = (username, nickname) => (dispatch) => {
    dispatch({ type: USER_LOADING });

    axios.post('/api/account/change_info/', {
        username: username,
        nickname: nickname,
    }, config)
    .then(res => {
        dispatch({
            type: SUCCESS_ALERT,
            payload: res.data.success
        })
        dispatch(getUser());
    })
    .catch(error => {
        let msg = 'Error to change your info'

        if (error.response) msg = error.response.data.error;
        else if (error.message) msg = error.message;

        dispatch({
            type: ERROR_ALERT,
            payload: msg
        })
    })
}


export const changePassword = (password) => (dispatch) => {
    dispatch({ type: USER_LOADING });

    axios.post('/api/account/change_password/', {
        password: password,
    }, config)
    .then(res => {
        dispatch({
            type: SUCCESS_ALERT,
            payload: res.data.success
        })
    })
    .catch(error => {
        let msg = 'Error to change password'

        if (error.response) msg = error.response.data.error;
        else if (error.message) msg = error.message;

        dispatch({
            type: ERROR_ALERT,
            payload: msg
        })
    })
}