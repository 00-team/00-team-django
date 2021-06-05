import axios from 'axios';
import {
    ANONYMOUS_USER,
    AUTH_ERROR,
    USER_LOADED,
    USER_LOADING,
} from './types';


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
