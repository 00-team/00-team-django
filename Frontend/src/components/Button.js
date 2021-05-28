import React from 'react'

const Button = ({ onClick, children, color, bgColor }) => {
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

export default Button
