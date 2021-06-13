import React, { useEffect, useState } from 'react'
import { Input, Button } from '../common/Elements'
import { FcGoogle } from 'react-icons/fc'
import { useAlert } from 'react-alert'

import './sass/login.scss'

var csrfToken = document.currentScript.getAttribute('csrfToken');

const go = (path) => window.location.replace(path);

const Login = () => {
    const [forgotForm, setForgotForm] = useState(false);
    const [registerForm, setRegisterForm] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const alert = useAlert();

    useEffect(() => {
        if (localStorage.username) setUsername(localStorage.username)
        if (localStorage.password) setPassword(localStorage.password)
    }, [])

    const sendLogin = () => {
        fetch('/api/account/login/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        }).then(r => r.json()).then(
            (r) => {
                if (r.success) {
                    localStorage.username = username;
                    localStorage.password = password;
                    go('/account');
                } else if (r.error) {
                    setError({msg: r.error})
                    alert.error(r.error)
                }
            }, 
            (error) => {
                alert.error(error)
            }
        )
    
    }

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
            <Button onClick={() => {sendLogin()}}>Login</Button>
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


    return (
        <div className='login-page'>
            <div className='login-form'>
                <div className='cool-img'></div>
                {forgotForm ? forgot : (registerForm ? register : login)}
            </div>
        </div>
    )
}

export default Login
