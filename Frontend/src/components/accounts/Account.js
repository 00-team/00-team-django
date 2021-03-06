// react stuffs
import React, { useEffect, useState } from 'react'

// icons
import { FiAtSign, FiUser, FiHexagon, FiStar, FiLock, FiCamera } from 'react-icons/fi'

// router
import { Redirect } from 'react-router-dom'

// alerts
import { useAlert } from 'react-alert'

// redux
import { useSelector, useDispatch } from 'react-redux'

// actions
import { getUser, changeInfo, changePassword } from '../../actions/account/account'
import { loadSprojects } from '../../actions/account/sprojects'

// loading
import PacmanLoader from 'react-spinners/PacmanLoader';
import { css } from '@emotion/react';

// components
import { Button, Input, PasswordInput } from '../common/Elements'
import Sprojects from './Sprojects'


// sass
import './sass/account.scss'


const go = path => window.location.replace(path);


const EditFlag = ({ setPP, user, PP, setInfo }) => {
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState({username: '', nickname: ''});


    return (<>
        <div className='edit-input' >
            <FiHexagon className='icon' />
            <Input placeholder='Name' defaultVal={user.nickname || 'No Name'} maxLength={50} 
                   onChange={e => setUserInfo({...userInfo, nickname: e.target.value})} />
        </div>

        <div className='edit-input' >
            <FiUser className='icon' />
            <Input placeholder='Username' defaultVal={user.username || 'No Username'} maxLength={140} 
                   onChange={e => setUserInfo({...userInfo, username: e.target.value})} />
        </div>

        <div className='edit-input' >
            <FiCamera className='icon' />
            <label className="file-input dark">
            <input style={{ display: 'none' }} type="file" accept=".png, .jpeg, .gif, .jpg" onChange={e => {setPP(e.target.files[0]);e.target.value = null}} />
                {PP ? PP.name : 'Chose a Profile Picture'}
            </label>
        </div>

        <div className='actions'>
            <Button onClick={() => {setInfo('info');setUserInfo({username: '', nickname: ''})}}>Back</Button>
            <Button onClick={() => {
                setPP(null);dispatch(changeInfo(userInfo.username, userInfo.nickname, PP));
            }}>Save</Button>
        </div>
    </>)
}

const ChangePasswordFlag = ({ setInfo }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [userPassword, setUserPassword] = useState('');

    return (<>
        <span>Enter New Password</span>

        <div className='edit-input' >
            <FiLock className='icon' />

            <form>
                <PasswordInput maxLength={4096} onChange={e => setUserPassword(e.target.value)} />
            </form>
        </div>

        <div className='actions'>
            <Button onClick={() => {setInfo('info')}}>Back</Button>
            <Button onClick={() => {
                if (userPassword.length > 7) dispatch(changePassword(userPassword));
                else alert.error('Your Password is too Short');
            }}>Save</Button>
        </div>
    </>)
}

const Account = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const acc = useSelector((state) => state.account);
    const sprojects = useSelector((state) => state.sprojects);
    const alerts = useSelector((state) => state.alerts);

    const [user, setUser] = useState({});
    const [info, setInfo] = useState('loading');
    
    const [profilePic, setProfilePic] = useState(null);

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

    const infoFrag = <>
        <span> <FiHexagon className='icon' /> {user.nickname || 'No Name'} </span>
        <span> <FiUser className='icon' /> {user.username || 'No Username'} </span>
        <span> <FiAtSign className='icon' /> {user.email || 'No Email'} </span>
        <span> <FiStar className='icon' /> {sprojects.sprojects.length || '0'} </span>

        <div className='actions'>
            {user.admin && <Button onClick={() => window.open(user.admin)}>Admin</Button>}
            <Button onClick={() => {setInfo('edit')}}>Edit</Button>
            <Button onClick={() => {setInfo('changepass')}}>Change Password</Button>
            <Button className='danger' onClick={() => go('/api/account/logout/')}>Logout</Button>
        </div>
    </>



    const loadingFrag = 
        <div className='loading-box'>
            <PacmanLoader color='#FFF' loading={true} css={LoaderCss} />
        </div>

    return (
        <div className='account'>
        {info === 'loading' ? loadingFrag :
            <div className='profile'>
                <div className='pp' style={
                    acc.picloading ? { backgroundImage: 'none', padding: 0 } : 
                    (profilePic ? { backgroundImage: `url(${window.URL.createObjectURL(profilePic)})` } :
                    (user.picture ? { backgroundImage: `url(${user.picture})` } : {}))
                } >
                    {acc.picloading ? 
                    <div className='loading-box' style={{ margin: '-25px 0 0 -25px' }}>
                        <PacmanLoader color='#FFF' loading={true} css={LoaderCss} />
                    </div> : <></>}
                </div>

                <div className='info'>
                    {info === 'info' && infoFrag}
                    {info === 'edit' && <EditFlag setPP={setProfilePic} user={user} PP={profilePic} setInfo={setInfo} />}
                    {info === 'changepass' && <ChangePasswordFlag setInfo={setInfo} />}
                </div>
            </div>}

            <Sprojects />
        </div>
    )
}

export default Account
