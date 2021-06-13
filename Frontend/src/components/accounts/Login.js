import React, { useEffect, useState } from 'react'

// components
import { Input, Button } from '../common/Elements'

// icons
import { FcGoogle } from 'react-icons/fc'

// alerts
import { useAlert } from 'react-alert'

// redux
import { useSelector, useDispatch } from 'react-redux';
import { login as loginRequest, register as registerReq, verifyCode as verifyCodeReq } from '../../actions/login';

import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

// style (sass)
import './sass/login.scss'

const go = (path) => window.location.replace(path);

const Login = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const logingState = useSelector((state) => state.login);
    const alerts = useSelector((state) => state.alerts);

    const [formFrag, setFormFrag] = useState('login'); // forgot, register, login, loading

    const [error, setError] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    useEffect(() => {
        if (alerts.info) {alert.info(alerts.info); dispatch({ type: 'INFO_ALERT', payload: null });}
        if (alerts.error) {alert.error(alerts.error); setError(true); dispatch({ type: 'ERROR_ALERT', payload: null });}
        if (alerts.success) {alert.success(alerts.success); dispatch({ type: 'SUCCESS_ALERT', payload: null });}
    }, [alerts])


    useEffect(() => {
        if (localStorage.username) setUsername(localStorage.username)
        if (localStorage.password) setPassword(localStorage.password)
    }, [localStorage])

    useEffect(() => {
        if (logingState.loading) setFF('loading');
        else if (logingState.needCode) setFF('code');
        else setFF('login');
    }, [logingState])

    

    const setFF = (frag) => {
        document.querySelectorAll("input").forEach(i => {
            i.value = '';
        })

        setEmail('');
        setUsername('');
        setPassword('');
        setCode('');
        setFormFrag(frag);
    }

    let codeFrag = <>
        <span>Code</span>
        <Input onChange={(e) => setCode(e.target.value)} placeholder='Code' />

        <div className='btn'>
            <Button onClick={() => {setFF('login')}}>Cancel</Button>
            <Button onClick={() => {dispatch(verifyCodeReq(logingState.email, code))}} >Verify</Button>
        </div>
    </>

    let social = 
    <div className='social'>
        <div className='custom-hr'>or</div>
        <Button className='google' onClick={() => {go('/api/account/login/google/?next=/account')}}> <FcGoogle /> </Button>
    </div>

    let forgotFrag = <>
        <span>Email address</span>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder='Email address' />
        <div className='btn'>
            <Button onClick={() => {setFF('login')}}>Back to Login</Button>
            <Button>Send Code</Button>
        </div>
    </>


    let loginFrag = <>
        <span>Username</span>
        <Input onChange={(e) => setUsername(e.target.value)} placeholder='Username' error={error} autoComp={username} />
        <span>Password</span>
        <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' error={error} autoComp={password} type='password' />

        <a onClick={() => {setFF('forgot')}}>Forgot Password</a>

        <div className='btn'>
            <Button onClick={() => {setFF('register')}}>Register</Button>
            <Button onClick={() => {dispatch(loginRequest(username, password))}}>Login</Button>
        </div>

        {social}
    </>


    let registerFrag = <>
        <span>Email address</span>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder='Email address' autoComp={email} />

        <span>Username</span>
        <Input onChange={(e) => setUsername(e.target.value)} placeholder='Username' autoComp={username} />

        <span>Password</span>
        <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' autoComp={password} />

        <div className='btn'>
            <Button onClick={() => {setFF('login')}}>Back to Login</Button>
            <Button onClick={() => {dispatch(registerReq(email, username, password))}} >Register</Button>
        </div>

        {social}
    </>

    let loadingFrag = <div className="form">
        <div className="loading-box">
            <PacmanLoader color='#FFF' loading={logingState.loading} css={css`width:auto;height:auto;margin-left: -90px;`} />
        </div>
    </div>


    return (
        <div className='login-page'>
            <div className='login-form'>
                <div className='cool-img'></div>
                <form onSubmit={e => e.preventDefault()} >
                    <div className="form">
                        {formFrag === 'loading' && loadingFrag}
                        {formFrag === 'login' && loginFrag}
                        {formFrag === 'register' && registerFrag}
                        {formFrag === 'forgot' && forgotFrag}
                        {formFrag === 'code' && codeFrag}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
