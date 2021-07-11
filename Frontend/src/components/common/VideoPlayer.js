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
    const timeline = useRef(null);
    const timelinePointer = useRef(null);
    const timelineBase = useRef(null);

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

    const UpdateTimeLine = (t, d) => {
        if (typeof t === 'number' && typeof d === 'number') {
            if (timeline) if (timeline.current) timeline.current.style.transform = `scaleX(${((1 / d) * t)})`;
            if (timelinePointer && timelineBase) {
                if (timelinePointer.current && timelineBase.current) {
                    timelinePointer.current.style.transform = `translateX(${((1 / d) * t) * timelineBase.current.offsetWidth}px)`;
                }
            }
                
        }
    }

    const UpdateVideoTimeLine = (t) => {
        if (vide) if (vide.current) {
            const ct = t * vide.current.duration
            UpdateTimeLine(ct, vide.current.duration)

            vide.current.currentTime = ct
        }
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
                   onTimeUpdate={e => {UpdateTimeLine(e.target.currentTime, e.target.duration);}}
            ></video>

            <div className={'controls show ' + (showControls ? ' show' : '')}>
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
                    <div ref={timelineBase} className='timeline-range' 
                        onClick={e => UpdateVideoTimeLine(e.nativeEvent.layerX / e.target.offsetWidth)}
                        onMouseDown={
                            e => {
                                e.preventDefault()

                                if (timeline) if (timeline.current) timeline.current.style.transition = 'none'

                                e.target.onmousemove = de => {
                                    de.preventDefault()
                                    UpdateVideoTimeLine(de.layerX / de.target.offsetWidth)
                                }

                                document.onmouseup = () => {
                                    e.target.onmousemove = null;
                                    document.onmouseup = null;
                                    if (timeline) if (timeline.current) timeline.current.style.transition = ''
                                }
                            }
                        }
                        >
                        <div ref={timeline} className="process"></div>
                    </div>
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
