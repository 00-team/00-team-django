import React, { useEffect, useState } from 'react'
import { FiAtSign, FiUser, FiHexagon, FiStar } from 'react-icons/fi'
import { useHistory, Redirect } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { getUser, loadSprojects } from '../../actions/auth'

import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

import { Button } from '../common/Elements'

var csrfToken = document.currentScript.getAttribute('csrfToken');


const go = (path) => window.location.replace(path);

const Projects = ({ projects, Rstar, history }) => {
    if (projects.length == 0) return <></>

    return (
        projects.map((p, i) =>
            <div key={i} className='project'>
                <div className='thumbnail' style={p.thumbnail ? { '--ps-bg-img':'url(' + p.thumbnail + ')' } : {}} onDoubleClick={() => {Rstar(p.id)}} >
                    <span onClick={() => history.push('/project/' + p.slug)} >{p.name}</span>
                </div>
                <div className='lw'>
                    <span className='lang'>{p.lang}</span>
                    <span className='wspace'>{p.wspace}</span>
                </div>
            </div>
        )
    )
}


const Account = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const [user, setUser] = useState({});
    const [projects, setProjects] = useState([]);
    const history = useHistory();
    const alert = useAlert()

    const LoaderCss = css`
        width: auto;
        height: auto;
    `;

    useEffect(() => {
        dispatch(getUser());
        dispatch(loadSprojects());
    }, [dispatch]);


    useEffect(() => {
        if (auth.user) {
            setUser(auth.user);
        }

        if (auth.sprojects) {
            setProjects(auth.sprojects);
        }

        if (auth.sprojectsError) alert.error(auth.sprojectsError)
    }, [auth]);


    const removeStar = (projectId) => {
        fetch('/api/projects/modify_star/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                project_id: projectId
            }),
        }).then(res => res.json())
        .then(
            (r) => {
                alert.success('Project Removed Successfully from Stard Projects')
            },
            (error) => {
                alert.error(error);
            }
        )

        setProjects(projects.filter((p) => p.id !== projectId))
    }

    if (auth.anonymous) {
        return <Redirect to='/login' />
    } else if (auth.userLoading) { // loading
        return (
            <div className='loading-box'>
                <PacmanLoader color='#FFF' loading={auth.userLoading} css={LoaderCss} />
            </div>
        )
    } else if (!user) {
        return <></>
    }


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
                    <span> <FiStar /> {projects.length} </span>

                    <div className='actions'>
                        <Button onClick={() => {}}>Edit</Button>
                        <Button onClick={() => {}}>Change Password</Button>
                        <Button color='#F00' bgColor='#E20338' onClick={() => go('/api/account/logout/')}>Logout</Button>
                    </div>
                </div>
            </div>
            {!auth.sprojectsError && 
            <div className='started-projects'>
                <span className='title'>Stared Projects</span>
                {auth.sprojectsLoading ? 
                <div className='loading-box-sprojects'>
                    <PacmanLoader color='#FFF' loading={auth.sprojectsLoading} css={LoaderCss} />
                </div>:
                <Projects projects={projects} Rstar={removeStar} history={history} />}
            </div>}
        </div>
    )
}

export default Account
