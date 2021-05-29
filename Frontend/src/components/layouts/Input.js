import React from 'react'

const Input = ({ type, onChange, placeholder, badInput }) => {
    return (
        <input type={type} className='dark' onChange={onChange} placeholder={placeholder} style={badInput ? { '--input-color': '#A00', '--input-f-color': '#F00' } : {}} />
    )
}


Input.defaultProps = {
    id: '',
    type: 'text',
    onChange: () => {},
    placeholder: '',
    badInput: false,
}

export default Input
