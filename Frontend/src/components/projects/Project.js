import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { LoadProject } from '../../actions/projects/project'
import { useDispatch, useSelector } from 'react-redux';

import PacmanLoader from 'react-spinners/PacmanLoader';
import { css } from '@emotion/react';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import './sass/project.scss';


const Project = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const project = useSelector(s => s.project)
    const [p, setProject] = useState(null)
    const [cDocIndex, setCDocIndex] = useState(0)
    const [cDoc, setCDoc] = useState({})

    useEffect(() => {
        dispatch(LoadProject(slug));
    }, [dispatch])

    useEffect(() => {
        if (!project.loading && project.project) {
            setProject(project.project);
            setCDoc(project.project.docs[0]);
        }
    }, [project])

    const LoadingFlag = <div className='loading-box' style={{ height: 'calc(100vh - 60px)' }} >
        <PacmanLoader color='#FFF' loading={true} css={css`width:auto;height:auto;`} />
    </div>

    const docIndexHandle = (x) => {
        let cdi = (cDocIndex + x);
        if (cdi >= p.docs.length) cdi = 0;
        if (cdi < 0) cdi = p.docs.length - 1;

        setCDocIndex(cdi);
        setCDoc(p.docs[cdi]);
    }

    const ProjectFlag = p && <>
        <div className='docs'>
            {p.docs.length > 1 && <>
                <div className="next" onClick={() => {docIndexHandle(+1)}} ><FiChevronRight /></div>
                <div className="previous" onClick={() => {docIndexHandle(-1)}} ><FiChevronLeft /></div>
            </>}

            {cDoc.type === 'image' && <div className='image-doc' style={{ backgroundImage: `url(${cDoc.image})` }}></div>}
            {cDoc.type === 'video' && <div className='video-doc'>
                <video controls poster={cDoc.thumbnail} src={cDoc.video}></video>
            </div>}
        </div>

        <div className='info'>
            <span className='name'>Name: {p.name}</span>
            <span>Start: {p.date_start}</span>
            <span>Stars: {p.stars}</span>
            <span>Language: {p.language}</span>
            <span>Workspace: {p.workspace}</span>
            <span>Status: {p.status}</span>
            {/* <span>{p.git}</span> */}
            {/* <span>{p.self_star}</span> */}
            <p>{p.description}</p>
        </div>
    </>

  
    return (<>
        {project.loading && LoadingFlag}
        {p && ProjectFlag}
    </>)
}

export default Project
