import React, { useRef, useState, useEffect } from 'react'

import { 
    FaPlay, FaPause, 
    FaVolumeMute, FaVolumeOff, FaVolumeDown, FaVolumeUp,

} from 'react-icons/fa'

import { FiSettings } from 'react-icons/fi';

import { BsFullscreen, BsFullscreenExit } from 'react-icons/bs';

// style
import './sass/video-player.scss'

const VideoPlayer = ({ source, poster }) => {
    const vide = useRef(null);
    const baseVide = useRef(null);
    const timeline = useRef(null)

    const [showControls, setShowControls] = useState(true);
    const [paused, setPaused] = useState(false);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [fs, setFS] = useState(false);
    const [settingsIsOpen, setSettingsIsOpen] = useState(false)

    useEffect(() => {
        if (vide.current) {setPaused(vide.current.paused);UpdateTimeLine(0);}
        setShowControls(true);
    }, [source])

    useEffect(() => {
        document.onfullscreenchange = () => {
            if (document.fullscreenElement === baseVide.current && document.fullscreenElement) setFS(true);
            else setFS(false);
        }
    }, [baseVide])


    const LoadTimeLine = (d) => {
        if (timeline) if (timeline.current) timeline.current.max = d;
    }

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

    const changeVolume = (v) => {
        if (v > 1) return;
        if (v < 0) return;

        setVolume(v);
        vide.current.volume = v;
    }

    const UpdateTimeLine = (t) => {
        if (timeline) if (timeline.current) timeline.current.value = t;
    }

    const UpdateVideoTimeLine = (t) => {
        if (vide) if (vide.current) vide.current.currentTime = t;
    }


    return (
        <div className='video-player' ref={baseVide} 
             onMouseEnter={() => setShowControls(true)} 
             onMouseLeave={() => setShowControls(false)}
        >
            <div className="poster" 
                 style={{ backgroundImage: `url(${poster})`, display: (paused ? '' : 'none') }} 
                 onClick={() => togglePlay()}
            ></div>

            <video src={source} ref={vide} 
                   onClick={() => togglePlay()} 
                   onEnded={e => {e.target.currentTime = 0;setPaused(e.target.paused);}}
                   onLoadedData={e => {LoadTimeLine(e.target.duration)}}
                   onTimeUpdate={e => {UpdateTimeLine(e.target.currentTime);}}
            ></video>

            <div className={'controls show' + (showControls ? ' show' : '')}>
                <div className="part play-volume">

                    <div className="cts play" onClick={() => togglePlay()} > 
                        {paused ? <FaPlay /> : <FaPause />}
                    </div>

                    <div className="cts volume" onClick={() => toggleMute()} >
                        {muted ? <FaVolumeMute /> : 
                        (volume < 0.05 ? <FaVolumeOff /> : 
                        (volume > 0.5 ? <FaVolumeUp /> : <FaVolumeDown />))}
                    </div>

                    <input type="range" min='0' max='1' step='0.01' className='input-range' 
                           style={{ width: '100px' }}
                           defaultValue={volume} 
                           onChange={e => {changeVolume(e.target.value)}}
                    />

                </div>

                <div className="part timeline">
                    <input ref={timeline} type="range" min='0' max='1' step='0.01' className='input-range' 
                           style={{ width: '100%' }}
                           onChange={e => {UpdateVideoTimeLine(e.target.value)}}
                           defaultValue={0}
                    />
                </div>
                    
                <div className="part settings-fullscreen">
                    <div className="cts settings" 
                         style={settingsIsOpen ? { transform: 'rotate(69deg)' } : {}} 
                         onClick={() => setSettingsIsOpen(!settingsIsOpen)} 
                    >
                        <FiSettings />
                    </div>
                    
                    <div className="cts fs" onClick={() => {toggleFullScreen()}} >
                        {fs ? <BsFullscreenExit /> : <BsFullscreen />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer