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



export const Input = ({ type, onChange, placeholder, error, autoComp, maxLength }) => {
    return (
        <input type={type} className={error ? 'error dark' : 'dark'} onChange={onChange} 
               placeholder={placeholder}  
               maxLength={maxLength} autoComplete={autoComp} />
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
