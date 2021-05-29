import React from 'react'
import { Link } from 'react-router-dom'


const Header = ({ user }) => {
    let linkTag = null
    if (!user) {
        linkTag = <Link to='/login'>Login</Link>
    } else if (!user.username) {
        linkTag = <Link to='/login'>Login</Link>
    } else {
        linkTag = <Link to='/account'>Account</Link>
    }

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


Header.defaultProps = {
    user: null
}

export default Header