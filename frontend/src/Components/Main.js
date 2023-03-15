import React, { Fragment, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from './Header'
import SideBar from './SideBar'

export default function Main({socket}) {
    const navigate = useNavigate()
    const d = new Date()

    useEffect(() => {
        if(d.getTime < localStorage.getItem('expired')) {
            navigate('/login')
        }
    }, [])

    return (
        <Fragment>
            <Header/>
            <SideBar socket={socket} />
            <Outlet/>
        </Fragment>
    )
}
