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
import { getUser, changeInfo } from '../../actions/account'
import { loadSprojects } from '../../actions/sprojects'

// loading
import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

// components
import { Button, Input } from '../common/Elements'
import Sprojects from './Sprojects'


// sass
import './sass/account.scss'


const go = path => window.location.replace(path);

const Account = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const acc = useSelector((state) => state.account);
    const sprojects = useSelector((state) => state.sprojects);
    const alerts = useSelector((state) => state.alerts);

    const [user, setUser] = useState({});
    const [info, setInfo] = useState('loading');
    
    const [userInfo, setUserInfo] = useState({username: '', nickname: ''});
    const [userPassword, setUserPassword] = useState({oldPass: '', newPass: '', confNewPass: ''});

    const LoaderCss = css`width:auto;height:auto;`;

    useEffect(() => {
        dispatch(getUser());
        dispatch(loadSprojects());
    }, [dispatch]);

    useEffect(() => {
        if (alerts.info) {alert.info(alerts.info); dispatch({ type: 'INFO_ALERT', payload: null });}
        if (alerts.error) {alert.error(alerts.error); dispatch({ type: 'ERROR_ALERT', payload: null });}
        if (alerts.success) {alert.success(alerts.success); dispatch({ type: 'SUCCESS_ALERT', payload: null });}
    }, [alerts])


    useEffect(() => {
        if (acc.user) {
            setUser(acc.user);
            setInfo('info');
        }
    }, [acc]);

    if (acc.anonymous) return <Redirect to='/login' />

    let infoFrag = <>
        <span> <FiHexagon /> {user.nickname || 'No Name'} </span>
        <span> <FiUser /> {user.username || 'No Username'} </span>
        <span> <FiAtSign /> {user.email || 'No Email'} </span>
        <span> <FiStar /> {sprojects.sprojects.length || '0'} </span>

        <div className='actions'>
            <Button onClick={() => {setInfo('edit')}}>Edit</Button>
            <Button onClick={() => {setInfo('changepass')}}>Change Password</Button>
            <Button className='danger' onClick={() => go('/api/account/logout/')}>Logout</Button>
        </div>
    </>

    let editFrag = <>
        <div className='edit-input' >
            <FiHexagon />
            <Input placeholder='Name' defaultVal={user.nickname || 'No Name'} maxLength={50} 
                   onChange={e => setUserInfo({...userInfo, nickname: e.target.value})} />
        </div>

        <div className='edit-input' >
            <FiUser />
            <Input placeholder='Username' defaultVal={user.username || 'No Username'} maxLength={140} 
                   onChange={e => setUserInfo({...userInfo, username: e.target.value})} />
        </div>

        <div className='actions'>
            <Button onClick={() => {setInfo('info');setUserInfo({username: '', nickname: ''})}}>Back</Button>
            <Button onClick={() => {
                dispatch(changeInfo(userInfo.username, userInfo.nickname))
            }}>Save</Button>
        </div>
    </>

    let changePassFrag = <>
        <div className='edit-input' >
            <FiUnlock />
            <Input placeholder='Old Password' defaultVal={userPassword.oldPass} maxLength={4096} 
                   onChange={e => setUserPassword({...userPassword, oldPass: e.target.value})} />
        </div>

        <span>Enter New Password</span>

        <div className='edit-input' >
            <FiLock />
            <Input placeholder='Password' defaultVal={userPassword.newPass} maxLength={4096} 
                   onChange={e => setUserPassword({...userPassword, newPass: e.target.value})} />
        </div>

        <div className='edit-input' >
            <FiLock />
            <Input placeholder='Confirm Password' defaultVal={userPassword.confNewPass} maxLength={4096} 
                onChange={e => setUserPassword({...userPassword, confNewPass: e.target.value})} />
        </div>

        <div className='actions'>
            <Button onClick={() => {setInfo('info')}}>Back</Button>
            <Button onClick={() => {console.log(userPassword)}}>Save</Button>
        </div>
    </>

    let loadingFrag = 
        <div className='loading-box'>
            <PacmanLoader color='#FFF' loading={true} css={LoaderCss} />
        </div>

    return (
        <div className='account'>
        {info === 'loading' ? loadingFrag :
            <div className='profile'>
                <div className='pp' style={user.picture ? { '--bg-img': 'url(' + user.picture + ')' } : {}} ></div>
                <div className='info'>
                    {info === 'info' && infoFrag}
                    {info === 'edit' && editFrag}
                    {info === 'changepass' && changePassFrag}
                </div>
            </div>}
            <Sprojects />
        </div>
    )
}

export default Account
