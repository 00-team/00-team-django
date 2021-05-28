import React, { useEffect } from 'react'
import Button from './Button'
import { FiAtSign, FiUser, FiHexagon, FiStar } from 'react-icons/fi'


var csrfToken = document.currentScript.getAttribute('csrfToken');

const go = (path) => window.location.replace(path);

const logout = () => {
    fetch('/api/account/logout/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrfToken
        },
    })
    .then(res => res.json())
    .then(
        (result) => {
            if (result.success) {
                go('/')
            } else {
                console.log(result.Error);
            }
        },
        (error) => {
            console.log(error);
        }
    )
}

const Account = ({ user }) => {
    if (!user) {
        go('/api/account/login/google/?next=/account')
    }

    let pic = user.picture

    if (pic) {
        pic = pic.slice(0,-5) + 's500-c'
    }

    if (user === true) return <></>

    return (
        <div className='account'>
            <div className='profile'>
                <div className='pp'>
                    <img src={pic} alt='your profile picture' />
                </div>
                <div className='info'>
                    <span> <FiHexagon /> {user.nickname} </span>
                    <span> <FiUser /> {user.username} </span>
                    <span> <FiAtSign /> {user.email} </span>
                    <span> <FiStar /> 100 </span>

                    <div className='actions'>
                        <Button onClick={() => {}}>Edit</Button>
                        <Button onClick={() => {}}>Change Password</Button>
                        <Button color='#F00' bgColor='#E20338' onClick={() => logout()}>Logout</Button>
                    </div>
                </div>
            </div>
            <div className='started-projects'>
                <span className='title'>Stared Projects</span>
                <div className='project'></div>
                <div className='project'></div>
                <div className='project'></div>
                <div className='project'></div>
            </div>
        </div>
    )
}

Account.defaultProps = {
    user: null,
}

export default Account
