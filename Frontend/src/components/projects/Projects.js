import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadProjects } from '../../actions/projects/projects';

// loading
import PacmanLoader from 'react-spinners/PacmanLoader';
import { css } from '@emotion/react';

import Select from 'react-select'
import { Link } from 'react-router-dom'
import { BsStar, BsStarFill } from 'react-icons/bs'

import HoverPlayer from '../common/HoverPlayer';

import './sass/projects.scss';

const Projects = () => {
    const dispatch = useDispatch();
    const projectsState = useSelector(s => s.projects)
    const [status, setStatus] = useState('loading')
    const [order, setOrder] = useState('time')
    const [projects, setProjects] = useState([])

    useEffect(() => {
        dispatch(LoadProjects());
    }, [dispatch]);

    useEffect(() => {
        if (projectsState.loading) setStatus('loading');
        else if (projectsState.projects.length <= 0) setStatus('nothing');
        else {
            setProjects(projectsState.projects || [])
            setStatus('projects');
        }
    }, [projectsState])


    const orderByStar = (a, b) => {
        if (a.stars > b.stars) return -1;
        else if (b.stars > a.stars) return 1;
        else {
            if (a.rawtime > b.rawtime) return -1;
            else if (b.rawtime > a.rawtime) return 1;
            else return 0;
        }
    }

    const orderByTime = (a, b) => {
        if (a.rawtime > b.rawtime) return -1;
        else if (b.rawtime > a.rawtime) return 1;
        else return 0;
    }

    const orderByName = (a, b) => {
        if (a.name > b.name) return 1;
        else if (b.name > a.name) return -1;
        else return 0;
    }

    const opt = [
        { value: 'time', label: 'Time' },
        { value: 'stars', label: 'Stars' },
        { value: 'name', label: 'Name' },
    ]

    const ProjectsFlag = <div className='projects'>
        <div className='header-projects'>
            <h2>00 Team Projects</h2> 
            <Select className='dp' classNamePrefix='dpp' options={opt} 
                    onChange={v => setOrder(v.value)} defaultValue={opt[0]} 
                    isSearchable={false} autoFocus={false} openMenuOnFocus={false} 
                    closeMenuOnSelect={true} closeMenuOnScroll={true} hideSelectedOptions={true}
            />
        </div>

        <div className='aps'>
            {(
                (order === 'time' && projects.sort(orderByTime)) ||
                (order === 'stars' && projects.sort(orderByStar)) ||
                (order === 'name' && projects.sort(orderByName)) ||
                []
            ).map((p, idx) => <Link key={idx} to={`/project/${p.slug}`}>
                <div className='project'>
                    <div className='thumbnail' style={!p.video && p.thumbnail ? { backgroundImage: `url(${p.thumbnail})` } : {}}>
                        {p.video && <HoverPlayer source={p.video} overlay={p.thumbnail} />}
                    </div>
                    <div className='info'>
                        <div className='hover-anim'>
                            <span className="name" title={p.name}>{p.name}</span>
                            <div className="lw">
                                <span className="lang" title={p.language}>{p.language}</span>
                                <span className="workspace" title={p.workspace}>{p.workspace}</span>
                            </div>
                        </div>
                        <div className="sd">
                            <div className="stars">
                                {p.self_star ? <BsStarFill /> : <BsStar />}
                                <span title={p.stars}>{p.stars}</span>
                            </div>
                            <span className="date" title={p.date_start}>{p.date_start}</span>
                        </div>
                    </div>
                </div>
            </Link>)}
        </div>
    </div>

    const LoadingFlag = <div className='loading-box' style={{ height: 'calc(100vh - 60px)' }} >
        <PacmanLoader color='#FFF' loading={true} css={css`width:auto;height:auto;`} />
    </div>

    const NothingSoFarFlag = <h2 style={{ color: '#FFF', textTransform: 'capitalize', marginTop: '40px' }}>nothing so far</h2>

    return (<>
        {status === 'loading' && LoadingFlag}
        {status === 'projects' && ProjectsFlag}
        {status === 'nothing' && NothingSoFarFlag}
    </>)
}

export default Projects
