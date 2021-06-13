import React, { useEffect, useState } from 'react'

// components
import { Input, Button } from '../common/Elements'

// icons
import { FcGoogle } from 'react-icons/fc'

// alerts
import { useAlert } from 'react-alert'

// redux
import { useSelector, useDispatch } from 'react-redux';
import { login as loginRequest } from '../../actions/login';

import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

// style (sass)
import './sass/login.scss'

// var csrfToken = document.currentScript.getAttribute('csrfToken');

const go = (path) => window.location.replace(path);

const Login = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const logingState = useSelector((state) => state.login);
    const alerts = useSelector((state) => state.alerts);

    const [forgotForm, setForgotForm] = useState(false);
    const [registerForm, setRegisterForm] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (alerts.info) {alert.info(alerts.info); dispatch({ type: 'INFO_ALERT', payload: null });}
        if (alerts.error) {alert.error(alerts.error); setError(true); dispatch({ type: 'ERROR_ALERT', payload: null });}
        if (alerts.success) {alert.success(alerts.success); dispatch({ type: 'SUCCESS_ALERT', payload: null });}
    }, [alerts])


    useEffect(() => {
        if (localStorage.username) setUsername(localStorage.username)
        if (localStorage.password) setPassword(localStorage.password)
    }, [])


    const clean = () => {
        document.querySelectorAll("input").forEach(i => {
            i.value = '';
        })

        setEmail('')
        setUsername('')
        setPassword('')
    }

    let social = 
    <div className='social'>
        <div className='custom-hr'>or</div>
        <Button className='google' onClick={() => {go('/api/account/login/google/?next=/account')}}> <FcGoogle /> </Button>
    </div>

    let forgot = 
    <div className='form'>
        <span>Email address</span>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder='Email address' />
        <div className='btn'>
            <Button onClick={() => {clean(); setForgotForm(false)}}>Back to Login</Button>
            <Button>Send Code</Button>
        </div>
    </div>


    let login = 
    <div className='form'>
        <span>Username</span>
        <Input onChange={(e) => setUsername(e.target.value)} placeholder='Username' badInput={error ? true : false} defaultVal={username} />
        <span>Password</span>
        <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' badInput={error ? true : false} defaultVal={password} type='password' />

        <a onClick={() => {clean(); setForgotForm(true)}}>Forgot Password</a>

        <div className='btn'>
            <Button onClick={() => {clean(); setRegisterForm(true)}}>Register</Button>
            <Button onClick={() => {dispatch(loginRequest(username, password))}}>Login</Button>
        </div>

        {social}
    </div>


    let register = 
    <div className='form'>
        <span>Email address</span>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder='Email address' />

        <span>Username</span>
        <Input onChange={(e) => setUsername(e.target.value)} placeholder='Username' />

        <span>Password</span>
        <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' />

        <div className='btn'>
            <Button onClick={() => {clean(); setRegisterForm(false)}}>Back to Login</Button>
            <Button>Register</Button>
        </div>

        {social}
    </div>

    let loadingFrag = <div className="form">
        <div className="loading-box">
            <PacmanLoader color='#FFF' loading={logingState.loading} css={css`width:auto;height:auto;margin-left: -90px;`} />
        </div>
    </div>


    return (
        <div className='login-page'>
            <div className='login-form'>
                <div className='cool-img'></div>
                {logingState.loading ? 
                    loadingFrag : (
                        forgotForm ? 
                            forgot : (
                                registerForm ? 
                                    register : login
                            )
                    )
                }
            </div>
        </div>
    )
}

export default Login
