import React, { useEffect, useState } from 'react'
import { FiAtSign, FiUser, FiHexagon, FiStar } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { useAlert } from 'react-alert'

import Button from './layouts/Button'

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
    const [user, setUser] = useState({});
    const [projects, setProjects] = useState([]);
    const history = useHistory();
    const alert = useAlert()

    useEffect(() => {
        fetch('/api/account/')
        .then(res => res.json())
        .then(
            (r) => {
                if (r.user) setProjects(r.user.stared_projects);
                setUser(r.user);
            },
            (error) => {
                alert.error(error)
            }
        );
    }, [])


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
            (r) => {
                if (r.success) go('/')
                else alert.error(r.Error);
            },
            (error) => {
                alert.error(error);
            }
        )
    }


    if (!user) { go('/login');return <></>; } else if (!user.username) return <></>


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
                        <Button color='#F00' bgColor='#E20338' onClick={() => logout()}>Logout</Button>
                    </div>
                </div>
            </div>
            <div className='started-projects'>
                <span className='title'>Stared Projects</span>
                <Projects projects={projects} Rstar={removeStar} history={history} />
            </div>
        </div>
    )
}

Account.defaultProps = {
    user: null,
}

export default Account
