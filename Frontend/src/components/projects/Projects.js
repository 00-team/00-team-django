import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { LoadProjects } from '../../actions/projects/projects'

// loading
import PacmanLoader from 'react-spinners/PacmanLoader';
import { css } from '@emotion/react';


const Projects = () => {
    const dispatch = useDispatch();
    const projects = useSelector(s => s.projects)
    const [status, setStatus] = useState('projects')

    useEffect(() => {
        dispatch(LoadProjects());
    }, [dispatch]);

    useEffect(() => {
        if (projects.loading) {
            setStatus('loading')
        } else {
            setStatus('projects')
        }
    }, [projects])

    const ProjectsFlag = <div className='projects'>
        <div className='header-projects'></div>
    </div>

    const LoadingFlag = <div className='loading-box' style={{ height: 'calc(100vh - 60px)' }} >
        <PacmanLoader color='#FFF' loading={true} css={css`width:auto;height:auto;`} />
    </div>

    return (<>
        {status === 'loading' && LoadingFlag}
        {status === 'projects' && ProjectsFlag}
    </>)
}

export default Projects
