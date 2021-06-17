import React from 'react'
import { useParams } from 'react-router-dom';

const Project = () => {
    let { slug } = useParams()
  
    return (
        <span style={{ color: '#FFF' }} >{slug}</span>
    )
}

export default Project
