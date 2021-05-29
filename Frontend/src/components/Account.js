import React, { useEffect, useState } from 'react'
import Button from './layouts/Button'
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

const Account = () => {
    const [user, setUser] = useState({});

    useEffect(() => {
        fetch('/api/account/')
        .then(res => res.json())
        .then(
            (result) => {
                setUser(result.user);
            },
            (error) => {
                console.log(error);
            }
        )
    }, [])

    if (!user) return go('/api/account/login/google/?next=/account');

    if (!user.username) return <div></div>;

    if (user.picture) {
        if (user.picture.slice(-5) === 's96-c') {
            user.picture = user.picture.slice(0,-5) + 's500-c'
        }
    }

    
    return (
        <div className='account'>
            <div className='profile'>
                <div className='pp' style={user.picture ? { '--bg-img': 'url(' + user.picture + ')' } : {}} ></div>
                <div className='info'>
                    <span> <FiHexagon /> {user.nickname} </span>
                    <span> <FiUser /> {user.username} </span>
                    <span> <FiAtSign /> {user.email} </span>
                    <span> <FiStar /> {user.stared_projects.length} </span>

                    <div className='actions'>
                        <Button onClick={() => {}}>Edit</Button>
                        <Button onClick={() => {}}>Change Password</Button>
                        <Button color='#F00' bgColor='#E20338' onClick={() => logout()}>Logout</Button>
                    </div>
                </div>
            </div>
            <div className='started-projects'>
                <span className='title'>Stared Projects</span>
                {user.stared_projects.map((p, i) => {
                    return <div key={i} className='project'></div>
                })}
            </div>
        </div>
    )
}

Account.defaultProps = {
    user: null,
}

export default Account
