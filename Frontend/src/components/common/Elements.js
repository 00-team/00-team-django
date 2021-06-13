import React from 'react'

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



export const Input = ({ type, onChange, placeholder, badInput, defaultVal, maxLength }) => {
    return (
        <input type={type} className={badInput ? 'error dark' : 'dark'} onChange={onChange} 
               placeholder={placeholder} defaultValue={defaultVal} 
               maxLength={maxLength} autoComplete={defaultVal} />
    )
}


Input.defaultProps = {
    type: 'text',
    onChange: () => {},
    placeholder: '',
    badInput: false,
    defaultVal: '',
    maxLength: null,
}


const Elements = () => {
    return (<></>)
}

export default Elements
