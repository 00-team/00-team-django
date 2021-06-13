import React from 'react'
import { VscInfo, VscError, VscCheck } from 'react-icons/vsc'

import './sass/alerts.scss'

const Alert = ({ message, options, close }) => {  
    let icon = null;
    let title = null;
    let c = null;

    if (options.type === 'info') {icon = <VscInfo color='#64C7FF' />; title = 'info'; c = '#64C7FF'}
    else if (options.type === 'success') {icon = <VscCheck color='#5BFF62' />; title = 'success'; c = '#5BFF62'}
    else if (options.type === 'error') {icon = <VscError color='#FF0000' />; title = 'error'; c = '#FF0000'}

    return (
        <div className='custom-alert-box' style={{ '--alert-color': c }} onClick={close} >
            <div className='title'>
                <span>{title}</span>
                {icon}
            </div>
            <div className='des'>
                <span>{message}</span>
            </div>
        </div>
    )
}

export default Alert
