import React from 'react'

export const Button = ({ onClick, children, color, bgColor }) => {
    let s = {}
    if (color) {
        s['--button-color'] = color
    }

    if (bgColor) {
        s['--button-bg-color'] = bgColor
    }

    return (
        <button className='dark' style={s} onClick={onClick} >
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
        <input type={type} className='dark' onChange={onChange} placeholder={placeholder} style={badInput ? { '--input-color': '#A00', '--input-f-color': '#F00' } : {}} defaultValue={defaultVal} maxLength={maxLength} autoComplete={defaultVal} />
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
