import React from 'react'

import './sass/errors.scss'

const Error = ({ code, title, description }) => {
    return (
        <div className="error-stuffs">
            <h2 className="error-code">{code }</h2>
            <h3 className="error-title">{ title }</h3>
            <p className="error-description">{ description }</p>
        </div>
    )
}


Error.defaultProps = {
    code: 'None',
    title: 'None',
    description: 'None',
}

export default Error
