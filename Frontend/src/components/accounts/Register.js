import React, { useState, useEffect } from 'react'
import { Input, Button, PasswordInput } from '../common/Elements'

import { useSelector, useDispatch } from 'react-redux';
import { register as RGQ, verifyCode as VCQ } from '../../actions/account/register';

import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

const Register = () => {
    const dispatch = useDispatch();

    const registerState = useSelector((state) => state.register);

    const [status, setStatus] = useState('register');
    const [error, setError] = useState({msg: '', email: false, username: false, password: false, code: false})
    const [data, setData] = useState({email: '', username: '', password: '', code: ''})

    useEffect(() => {
        setData({
            ...data,
            email: localStorage.email || '', 
            username: localStorage.username || '', 
            password: localStorage.password || '',
        })
    }, [localStorage])

    useEffect(() => {
        console.log(registerState);
        if (registerState.needCode) {
            setStatus('verify')
        } else if (registerState.loading) {
            setStatus('loading')
        } else {
            setStatus('register')
        }

        if (registerState.error) {
            let efield = registerState.error.field;
            setError({
                ...error, 
                msg: registerState.error.msg,
                email: (efield === 'email' || efield === 'all'),
                username: (efield === 'username' || efield === 'all'),
                password: (efield === 'password' || efield === 'all'),
                code: (efield === 'code' || efield === 'all'),
            })
        }

    }, [registerState])

    const RegisterForm = <>
        <span>Email address</span>
        <Input onChange={(e) => setData({...data, email: e.target.value})} error={error.email} placeholder='Email address' autoComp={data.email} />

        <span>Username</span>
        <Input onChange={(e) => setData({...data, username: e.target.value})} error={error.username} placeholder='Username' autoComp={data.username} />

        <span>Password</span>
        <PasswordInput onChange={(e) => setData({...data, password: e.target.value})} error={error.password} placeholder='Password' autoComp={data.password} />

        <div className='btn'>
            <Button onClick={() => {dispatch(RGQ(data.email, data.username, data.password))}} >Register</Button>
        </div>
    </>

    const VerifyCodeForm = <>
        <span>Code</span>
        <Input onChange={e => setData({...data, code: e.target.value})} error={error.code} placeholder='Code' />

        <div className='btn'>
            <Button onClick={() => {dispatch(VCQ(data.email, data.code))}} >Verify</Button>
        </div>
    </>

    const LoadingFrag = 
    <div className="loading-box">
        <PacmanLoader color='#FFF' loading={registerState.loading} css={css`width:auto;height:auto;margin-left: -90px;`} />
    </div>


    return (<>
        {status === 'register' && RegisterForm}
        {status === 'verify' && VerifyCodeForm}
        {status === 'loading' && LoadingFrag}
    </>)
}

export default Register
