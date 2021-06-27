import axios from 'axios';
import {
    GET_PROJECT,
    LOADING_PROJECT,
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

export const LoadProject = (slug) => (dispatch) => {
    dispatch({ type: LOADING_PROJECT, payload: true });

    axios.get(`/api/projects/p/${slug}/`)
    .then(res => {
        dispatch({
            type: GET_PROJECT,
            payload: res.data.project
        });
    })
    .catch(error => {
        dispatch({
            type: ERROR_ALERT,
            payload: error.response ? error.response.data.error : error.message || 'Error to load project'
        });
    })
    .then(() => dispatch({ type: LOADING_PROJECT, payload: false }))
}