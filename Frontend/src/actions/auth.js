import axios from 'axios';
import {
    // user auth
    ANONYMOUS_USER,
    AUTH_ERROR,
    USER_LOADED,
    USER_LOADING,

    // stared projects
    SPROJECTS_LOADED,
    SPROJECTS_ERROR,
    SPROJECTS_LOADING
} from './types';


// const config = {
//     headers: {
//         'Content-Type': 'application/json',
//     },
// };

export const getUser = () => (dispatch) => {
    dispatch({ type: USER_LOADING });

    axios.get('/api/account/')
    .then(
        (res) => {
            if (res.status === 203) {
                dispatch({ type: ANONYMOUS_USER });
            } else if (res.status === 200 && res.data.user) {
                dispatch({
                    type: USER_LOADED,
                    payload: res.data.user,
                });
            } else {
                dispatch({
                    type: AUTH_ERROR,
                    payload: res.data.error || 'Error get user informations'
                });
            }
        }
    ).catch(
        (error) => {
            dispatch({
                type: AUTH_ERROR,
                payload: error || 'Error get user informations'
            });
        }
    )
}


export const loadSprojects = () => (dispatch) => {
    dispatch({ type: SPROJECTS_LOADING });

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
