// react stuffs
import React, { useEffect, useState } from 'react'

// alerts
import { useAlert } from 'react-alert'

// redux
import { useSelector, useDispatch } from 'react-redux'

// actions
// import { removeSproject, loadSprojects } from '../../actions/account'
import { loadSprojects, toggleSproject } from '../../actions/sprojects'

// loading
import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

// router
import { useHistory } from 'react-router-dom'

const Sprojects = () => {
    const dispatch = useDispatch();
    const sprojects = useSelector((state) => state.sprojects);
    const [projects, setProjects] = useState([]);
    const history = useHistory();
    const alert = useAlert();

    const LoaderCss = css`width:auto;height:auto;`;

    useEffect(() => {
        dispatch(loadSprojects());
    }, [dispatch]);

    useEffect(() => {
        if (typeof sprojects.sprojects === 'object') setProjects(sprojects.sprojects);
        if (sprojects.error) alert.error(sprojects.error);
    }, [sprojects]);


    if (sprojects.loading) {
        return (
            <div className='loading-box-sprojects'>
                <PacmanLoader color='#FFF' loading={sprojects.loading} css={LoaderCss} />
            </div>
        )
    }

    let element = projects.map((p, i) =>
    <div key={i} className='project'>
        <div className='thumbnail' 
             style={p.thumbnail ? { '--ps-bg-img':'url(' + p.thumbnail + ')' } : {}} 
             onDoubleClick={() => {dispatch(toggleSproject(p.id));}} >

            <span onClick={() => history.push('/project/' + p.slug)} >{p.name}</span>
        </div>
        <div className='lw'>
            <span className='lang'>{p.lang}</span>
            <span className='wspace'>{p.wspace}</span>
        </div>
    </div>)

    if (sprojects.error) {
        element = <span className='reason'>We have some error, reload or report</span>
    }

    if (projects.length === 0) {
        element = <span className='reason'>Nothing so far</span>
    }


    return (
        <div className='started-projects'>
            <span className='title'>Stared Projects</span>
            {element}
        </div>
    )
}

export default Sprojects
