import axios from 'axios';
import {
    GET_PROJECTS,
    LOADING_PROJECTS,
} from './types';

import {
    SUCCESS_ALERT,
    ERROR_ALERT,
    INFO_ALERT,
} from '../base/types'

import { get as GC } from 'js-cookie';

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.currentScript.getAttribute('csrfToken') || GC('csrftoken')
    },
};

export const LoadProjects = () => (dispatch) => {
    dispatch({ type: LOADING_PROJECTS, payload: true });

    axios.get('/api/projects/')
    .then(res => {
        dispatch({
            type: GET_PROJECTS,
            payload: res.data.projects || []
        });
    })
    .catch(error => {
        dispatch({
            type: ERROR_ALERT,
            payload: error.response ? error.response.data.error : error.message || 'Error to load projects'
        });
    })
    .then(() => dispatch({ type: LOADING_PROJECTS, payload: false }))
}