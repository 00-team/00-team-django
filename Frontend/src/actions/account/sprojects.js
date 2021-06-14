import axios from 'axios';
import {
    SPROJECTS_LOADING,
    SPROJECTS_LOADED,

    ADD_SPROJECTS,
    REMOVE_SPROJECTS,
} from './types';

import {
    SUCCESS_ALERT,
    ERROR_ALERT,
    INFO_ALERT,
} from '../base/types'

import Cookies from 'js-cookie';
const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.currentScript.getAttribute('csrfToken') || Cookies.get('csrftoken')
    },
};


export const loadSprojects = () => (dispatch) => {
    dispatch({ type: SPROJECTS_LOADING });

    axios.get('/api/account/sprojects/')
    .then(res => {
        if (res.status === 200 && res.data.stared_projects) {
            dispatch({
                type: SPROJECTS_LOADED,
                payload: res.data.stared_projects,
            });
        }
    })
    .catch(error => {
        dispatch({
            type: ERROR_ALERT,
            payload: error.response ? (error.response.data.error) || 'Error to load stared projects' : error.message,
        });
    })
}


export const toggleSproject = (projectId) => (dispatch) => {
    dispatch({ type: SPROJECTS_LOADING });

    axios.post('/api/projects/modify_star/', {
        project_id: projectId
    }, config)
    .then((res) => {
        if (res.status === 200) {
            if (res.data.action === 'add') {
                dispatch({ 
                    type: ADD_SPROJECTS,
                    payload: res.data.project,
                });
                dispatch({ 
                    type: SUCCESS_ALERT,
                    payload: 'Successfully add a Stared Project',
                });
            } else if (res.data.action === 'remove') {
                dispatch({ 
                    type: REMOVE_SPROJECTS,
                    payload: res.data.project_id,
                });
                dispatch({ 
                    type: SUCCESS_ALERT,
                    payload: 'Successfully remove a Stared Project',
                });
            }
        }

    })
    .catch(error => {
        dispatch({
            type: ERROR_ALERT,
            payload: error.response ? (error.response.data.error) || 'Cant add/remove star project' : error.message,
        });
    })
}
