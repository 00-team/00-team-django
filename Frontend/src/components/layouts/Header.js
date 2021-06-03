import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { getUser } from '../../actions/auth'


const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);


    let linkTag = <Link to='/login'>Login</Link>

    if (auth.userLoading) linkTag = <Link to='#'>Loading</Link>
    else if (auth.error) alert.error(auth.error)
    else if (auth.user) linkTag = <Link to='/account'>Account</Link>

    return (
        <div className='base-menu'>
            <div className="btn-bar">
                <span></span>
            </div>
            <div className="menu-bar">
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
                        {linkTag}
                    </li>
                </ul>
            </div>
        </div>
    )
}


export default Header;
