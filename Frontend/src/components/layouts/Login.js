import React, { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Account from '../Account'
import { FcGoogle } from 'react-icons/fc'

var csrfToken = document.currentScript.getAttribute('csrfToken');

const go = (path) => window.location.replace(path);

const Login = () => {
    const [forgotForm, setForgotForm] = useState(false)
    const [registerForm, setRegisterForm] = useState(false)
    const [error, setError] = useState(null)
    const [email, setEmail] = useState(null)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

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
                console.log(r);
                if (r.success) {
                    go('/account')
                } else if (r.Error) {
                    setError({msg: r.Error})
                }
            }, 
            (error) => {
                console.log(error);
            }
        )
    
    }

    const clean = () => {
        document.querySelectorAll("input").forEach(i => {
            i.value = '';
        })

        setEmail(null)
        setUsername(null)
        setPassword(null)
    }

    let social = <>
        <div className='hr2' style={{ '--w': '100%', '--bg': '#FFF', margin: '10px 0' }}>or</div>
        <Button color='#FFF' bgColor='#FFF' className='google' onClick={() => {go('/api/account/login/google/?next=/account')}}> <FcGoogle /> </Button>
    </>

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
        <Input onChange={(e) => setUsername(e.target.value)} placeholder='Username' badInput={error ? true : false} />
        <span>Password</span>
        <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' badInput={error ? true : false} />

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
