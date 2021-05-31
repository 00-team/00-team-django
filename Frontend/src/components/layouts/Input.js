import React from 'react'

const Input = ({ type, onChange, placeholder, badInput, defaultVal }) => {
    return (
        <input type={type} className='dark' onChange={onChange} placeholder={placeholder} style={badInput ? { '--input-color': '#A00', '--input-f-color': '#F00' } : {}} defaultValue={defaultVal} />
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
