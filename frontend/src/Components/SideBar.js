import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsMegaphoneFill } from "react-icons/bs";

export default function SideBar({socket}) {
    const location = useLocation()
    const [notif, setNotif] = useState(0)
    const [notifStatus, setNotifStatus] = useState(true)

    const handleScroll = () => {
        window.scrollTo(0, 0)
    }

    useEffect(() => {
        if(notifStatus) {
            socket.emit('getUnreadNotif', {})
            setNotifStatus(false)
        }
        socket.on('sendUnreadNotif', (data) => {
            setNotif(data.notif)
        })
    }, [])

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4 sidebar-wrapper">
            <Link onClick={handleScroll} to={'/admin'} className="brand-link">
                <img src="/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: ".8" }}/>
                <span className="brand-text font-weight-light">BukuBook Admin</span>
            </Link>

            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src="/dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User"/>
                    </div>
                    <div className="info">
                        <a href='?'>Ageng</a>
                    </div>
                </div>

                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item">
                            <Link onClick={handleScroll} to={'/admin'} className={location.pathname === '/admin' || location.pathname.indexOf('social') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-tachometer-alt"></i>
                                <p>Siteconfig</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={handleScroll} to={'/admin/buku'} className={location.pathname.indexOf('/buku') > -1  || location.pathname.indexOf('/genre') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-book"></i>
                                <p>Buku</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={handleScroll} to={'/admin/artikel'} className={location.pathname.indexOf('/artikel') > -1 || location.pathname.indexOf('/kategori') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-copy"></i>
                                <p>Artikel</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={handleScroll} to={'/admin/banner'} className={location.pathname.indexOf('/banner') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-columns"></i>
                                <p>Banner</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={handleScroll} to={'/admin/order'} className={location.pathname.indexOf('/order') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-store"></i>
                                <p>Order</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={handleScroll} to={'/admin/broadcast'} className={location.pathname.indexOf('/broadcast') > -1 ? 'nav-link active' : 'nav-link'}>
                                <BsMegaphoneFill className='nav-icon'/>
                                <p>Broadcast</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={handleScroll} to={'/admin/livechat'} className={location.pathname.indexOf('/livechat') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="fas fa-comments nav-icon"></i>
                                <p>
                                    Live Chat
                                    {notif > 0 ? <span className="badge badge-danger right">{notif}</span> : ''}
                                </p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={handleScroll} to={'/admin/kupon'} className={location.pathname.indexOf('/kupon') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="fa-solid fa-ticket nav-icon"></i>
                                <p>Kupon</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}
