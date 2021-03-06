import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { getUser } from '../../actions/account/account'

import './sass/header.scss'

const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const account = useSelector((state) => state.account);
    const isMobile = useSelector(s => s.base.isMobile);
    const [accountLink, setLink] = useState(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        if (account.anonymous) setLink(<Link to='/login'>Login</Link>);
        else if (account.user) setLink(<Link to='/account'>Account</Link>);
        else if (account.loading) setLink(<Link to='#'>Loading</Link>);
        else if (account.error) alert.error(account.error);
    }, [account]);


    const MobileNavFlag = <div className='mobile-nav'>
        <div className='top-bar'>
            <div className={"btn-bar" + (active ? ' active' : '')} onClick={() => setActive(!active)}>
                <span></span>
            </div>

            <h1>00 Team</h1>
        </div>
        

        <div className={"side-bar" + (active ? ' active' : '')}>
            <ul className="tree-link">
                <li className="link">
                    <Link to="/">Home</Link>
                    <div className="spacel"></div>
                </li>
                
                <li className="link">
                    <Link to="/projects">Projects</Link>
                    <div className="spacel"></div>
                </li>

                <li className="link">
                    <Link to="/join">Join Team</Link>
                    <div className="spacel"></div>
                </li>

                <li className="link">
                    {accountLink}
                </li>
            </ul>
        </div>

    </div>

    const DesktopNavFlag = <div className='desktop-nav'>
        <div className="togo">
            <span>00 Team</span>
        </div>
        <ul className="tree-link">
            <li className="link">
                <Link to="/">Home</Link>
                <div className="spacel"></div>
            </li>
            
            <li className="link">
                <Link to="/projects">Projects</Link>
                <div className="spacel"></div>
            </li>

            <li className="link">
                <Link to="/join">Join Team</Link>
                <div className="spacel"></div>
            </li>

            <li className="link">
                {accountLink}
            </li>
        </ul>
    </div>

    return (
        <div className='header'>
            {isMobile ? MobileNavFlag : DesktopNavFlag}
        </div>
    )
}


export default Header;
