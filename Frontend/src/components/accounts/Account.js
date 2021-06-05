// react stuffs
import React, { useEffect, useState } from 'react'

// icons
import { FiAtSign, FiUser, FiHexagon, FiStar, FiLock, FiUnlock } from 'react-icons/fi'

// router
import { Redirect } from 'react-router-dom'

// alerts
import { useAlert } from 'react-alert'

// redux
import { useSelector, useDispatch } from 'react-redux'

// actions
import { getUser } from '../../actions/account'
import { loadSprojects } from '../../actions/sprojects'

// loading
import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

// components
import { Button, Input } from '../common/Elements'
import Sprojects from './Sprojects'


const go = (path) => window.location.replace(path);

const Account = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const acc = useSelector((state) => state.account);
    const sprojects = useSelector((state) => state.sprojects);

    const [user, setUser] = useState({});
    const [info, setInfo] = useState('info');

    const LoaderCss = css`width:auto;height:auto;`;

    useEffect(() => {
        dispatch(getUser());
        dispatch(loadSprojects());
    }, [dispatch]);


    useEffect(() => {
        if (acc.user) setUser(acc.user);
        if (sprojects.error) alert.error(sprojects.error);
    }, [acc]);

    if (acc.anonymous) return <Redirect to='/login' />
    else if (acc.userLoading) { // loading
        return (
            <div className='loading-box'>
                <PacmanLoader color='#FFF' loading={acc.userLoading} css={LoaderCss} />
            </div>
        )
    } 
    
    if (!user) return <></>

    if (user.picture) {
        if (user.picture.slice(-5) === 's96-c') {
            user.picture = user.picture.slice(0,-5) + 's500-c'
        }
    }

    let infoFrag = <>
        <span> <FiHexagon /> {user.nickname || 'No Name'} </span>
        <span> <FiUser /> {user.username || 'No Username'} </span>
        <span> <FiAtSign /> {user.email || 'No Email'} </span>
        <span> <FiStar /> {sprojects.sprojects.length || '0'} </span>

        <div className='actions'>
            <Button onClick={() => {setInfo('edit')}}>Edit</Button>
            <Button onClick={() => {setInfo('changepass')}}>Change Password</Button>
            <Button color='#F00' bgColor='#E20338' onClick={() => go('/api/account/logout/')}>Logout</Button>
        </div>
    </>

    let editFrag = <>
        <div className='edit-input' ><FiHexagon /> <Input placeholder='Name' defaultVal={user.nickname || 'No Name'} maxLength={50} /></div>
        <div className='edit-input' ><FiUser /> <Input placeholder='Username' defaultVal={user.username || 'No Username'} maxLength={140} /></div>

        <div className='actions'>
            <Button onClick={() => {setInfo('info')}}>Back</Button>
            <Button onClick={() => {}}>Save</Button>
        </div>
    </>

    let changePassFrag = <>
        <div className='edit-input' ><FiUnlock /> <Input placeholder='Old Password' defaultVal='' maxLength={4096} /></div>
        <span>Enter New Password</span>
        <div className='edit-input' ><FiLock /> <Input placeholder='Password' defaultVal='' maxLength={4096} /></div>
        <div className='edit-input' ><FiLock /> <Input placeholder='Confirm Password' defaultVal='' maxLength={4096} /></div>

        <div className='actions'>
            <Button onClick={() => {setInfo('info')}}>Back</Button>
            <Button onClick={() => {}}>Save</Button>
        </div>
    </>

    return (
        <div className='account'>
            <div className='profile'>
                <div className='pp' style={user.picture ? { '--bg-img': 'url(' + user.picture + ')' } : {}} ></div>
                <div className='info'>
                {info === 'info' && infoFrag}
                {info === 'edit' && editFrag}
                {info === 'changepass' && changePassFrag}
                </div>
            </div>
            <Sprojects />
        </div>
    )
}

export default Account
