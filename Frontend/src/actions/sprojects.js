import axios from 'axios';
import {
    SPROJECTS_LOADING,
    SPROJECTS_LOADED,
    SPROJECTS_ERROR,

    ADD_SPROJECTS,
    REMOVE_SPROJECTS,
} from './types';

var csrfToken = document.currentScript.getAttribute('csrfToken');

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
    },
};


export const loadSprojects = () => (dispatch) => {
    dispatch({ 
        type: SPROJECTS_LOADING,
        payload: true,
    });

    axios.get('/api/account/sprojects/')
    .then(
        (res) => {
            if (res.status === 200 && res.data.stared_projects) {
                dispatch({
                    type: SPROJECTS_LOADED,
                    payload: res.data.stared_projects,
                });
            } else if (res.data.error || res.data.Error) {
                dispatch({
                    type: SPROJECTS_ERROR,
                    payload: res.data.error || res.data.Error || 'Error to load stared projects'
                });
            }

            dispatch({ 
                type: SPROJECTS_LOADING,
                payload: false,
            });
        }
    ).catch(
        (err) => {
            dispatch({
                type: SPROJECTS_ERROR,
                payload: err.message + '. Cant Load Stared Projects' || 'Error to load stared projects'
            });
        }
    )
}


export const toggleSproject = (projectId) => (dispatch) => {
    dispatch({ 
        type: SPROJECTS_LOADING,
        payload: true,
    });

    axios.
    post('/api/projects/modify_star/', {project_id:projectId}, config).
    then((res) => {
        if (res.status === 200) {
            if (res.data.action === 'add') {
                dispatch({ 
                    type: ADD_SPROJECTS,
                    payload: res.data.project,
                });
            } else if (res.data.action === 'remove') {
                dispatch({ 
                    type: REMOVE_SPROJECTS,
                    payload: res.data.project_id,
                });
            } else {
                dispatch({
                    type: SPROJECTS_ERROR,
                    payload: res.data.error || res.data.Error || 'Cant add/remove star project'
                })
            }
        }

        dispatch({ 
            type: SPROJECTS_LOADING,
            payload: false,
        });

    }).catch((error) => {
        console.log(error);
        dispatch({
            type: SPROJECTS_ERROR,
            payload: error || 'Cant add/remove star project'
        })
    })
}
