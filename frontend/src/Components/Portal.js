import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Portal() {
    const navigate = useNavigate()
    const d = new Date()
    useEffect(() => {
        if(d.getTime() < localStorage.getItem('expired')) {
            navigate('/admin')
        } else {
            navigate('/password')
        }
    }, [])
}
