import React, { useState, useRef } from 'react'

import './sass/hover-player.scss';

const HoverPlayer = ({ source, overlay }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const vid = useRef(null)

    const playVid = () => {
        if (vid.current) {
            vid.current.play()
            setIsPlaying(true);
        }
    }

    const pauseVid = () => {
        if (vid.current) {
            vid.current.pause()
            setIsPlaying(false);
        }
    }

    return (
        <div className='hover-player' 
             onMouseEnter={() => playVid()}
             onMouseLeave={() => pauseVid()}
        >
            <div className={'overlay' + (!isPlaying ? ' show' : '')} style={overlay ? { backgroundImage: `url(${overlay})` } : {}}></div>
            <video ref={vid} src={source} loop muted></video>
        </div>
    )
}

export default HoverPlayer
