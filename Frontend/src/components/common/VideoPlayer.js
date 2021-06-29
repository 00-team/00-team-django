import React, { useRef, useState, useEffect } from 'react'

import { 
    FaPlay, FaPause, 
    FaVolumeMute, FaVolumeOff, FaVolumeDown, FaVolumeUp,

} from 'react-icons/fa'

import { IoMdSettings } from 'react-icons/io';

import { BsFullscreen, BsFullscreenExit } from 'react-icons/bs';

// style
import './sass/video-player.scss'

const VideoPlayer = ({ source, poster }) => {
    const vide = useRef(null);
    const baseVide = useRef(null);

    const [showControls, setShowControls] = useState(false);
    const [paused, setPaused] = useState(false);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [fs, setFS] = useState(false);

    useEffect(() => {
        if (vide.current) setPaused(vide.current.paused);
    }, [source])

    useEffect(() => {
        baseVide.current.onmouseenter = () => setShowControls(true);
        baseVide.current.onmouseleave = () => setShowControls(false);
        baseVide.current.onfullscreenchange = () => {
            if (document.fullscreenElement === baseVide.current && document.fullscreenElement) {
                setFS(true)
            } else {
                setFS(false)
            }
        }
    }, [baseVide])

    useEffect(() => {
        vide.current.onended = () => {
            vide.current.currentTime = 0;
            setPaused(vide.current.paused);
        }

        // requestFullscreen

    }, [vide])


    const togglePlay = () => {
        vide.current.paused ? vide.current.play() : vide.current.pause();
        setPaused(vide.current.paused);
    }

    const toggleMute = () => {
        vide.current.muted = !vide.current.muted
        setMuted(vide.current.muted);
    }

    const toggleFullScreen = () => {
        if (!document.fullscreenEnabled) return;
        if (document.fullscreenElement === baseVide.current) {
            document.exitFullscreen()
            setFS(false)
        } else {
            baseVide.current.requestFullscreen()
            setFS(true)
        }
    }

    return (
        <div className='video-player' ref={baseVide}>
            <div className="poster" 
                 style={{ backgroundImage: `url(${poster})`, display: (paused ? '' : 'none') }} 
                 onClick={() => togglePlay()}
            ></div>
            <video src={source} ref={vide} onClick={() => togglePlay()} ></video>
            <div className={'controls' + (showControls ? ' show' : '')}>
                <div className="part play-volume">
                    <div className="cts play" onClick={() => togglePlay()} > 
                        {paused ? <FaPlay /> : <FaPause />}
                    </div>
                    <div className="cts volume" onClick={() => toggleMute()} >
                        {muted ? <FaVolumeMute /> : <FaVolumeUp /> }
                    </div>
                </div>
                <div className="part settings-fullscreen">
                    <div className="cts settings"> <IoMdSettings /> </div>
                    <div className="cts fs" onClick={() => {toggleFullScreen()}} >
                        {fs ? <BsFullscreenExit /> : <BsFullscreen />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
