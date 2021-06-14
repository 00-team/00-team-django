import React, { useState, useEffect } from 'react'
import { BsEyeSlash, BsEye } from 'react-icons/bs'


export const Button = ({ onClick, children, className }) => {
    return (
        <button className={className ? className + ' dark' : 'dark'} onClick={onClick} >
            {children}
        </button>
    )
}

Button.defaultProps = {
    onClick: () => {},
    color: null,
    bgColor: null,
}



export const Input = ({ type, onChange, placeholder, error, autoComp, maxLength, defaultVal }) => {
    return (
        <input type={type} className={error ? 'error dark' : 'dark'} onChange={onChange} 
               placeholder={placeholder}  
               maxLength={maxLength} autoComplete={autoComp} 
               defaultValue={defaultVal} 
        />
    )
}


Input.defaultProps = {
    type: 'text',
    onChange: () => {},
    placeholder: '',
    error: false,
    defaultVal: '',
    maxLength: null,
    autoComp: '',
}


export const PasswordInput = ({ onChange, error, autoComp, maxLength, placeholder }) => {
    const [show, setShow] = useState(false);
    const [type, setType] = useState('password');

    useEffect(() => {
        show ? setType('text') : setType('password')
    }, [show])

    return (
        <div className="password-input">
            <input type={type} className={error ? 'error dark' : 'dark'} onChange={onChange} 
                placeholder={placeholder}  
                maxLength={maxLength} autoComplete={autoComp} 
            />
            <div className='toggle-show' onClick={() => {setShow(!show)}}>{show ? <BsEye /> : <BsEyeSlash />}</div>
        </div>
    )
}


PasswordInput.defaultProps = {
    onChange: () => {},
    placeholder: 'Password',
    error: false,
    maxLength: null,
    autoComp: '',
}

const Elements = () => {
    return (<></>)
}

export default Elements
