// react stuffs
import React, { useEffect } from 'react'

// redux
import { useSelector, useDispatch } from 'react-redux'

// actions
import { loadSprojects, toggleSproject } from '../../actions/sprojects'

// loading
import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

// router
import { useHistory } from 'react-router-dom'

const Sprojects = () => {
    const dispatch = useDispatch();
    const sprojects = useSelector((state) => state.sprojects);
    const history = useHistory();

    useEffect(() => {
        dispatch(loadSprojects());
    }, [dispatch]);


    if (sprojects.loading) {
        return (
            <div className='loading-box-sprojects'>
                <PacmanLoader color='#FFF' loading={sprojects.loading} css={css`width:auto;height:auto;`} />
            </div>
        )
    }

    const projectFrag = sprojects.sprojects.map((p, i) =>
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

    const nothingSP = <span className='reason'>Nothing so far</span>


    return (
        <div className='started-projects'>
            <span className='title'>Stared Projects</span>
            {sprojects.sprojects.length === 0 ? nothingSP : projectFrag}
        </div>
    )
}

export default Sprojects
