import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function SideBar() {
    const location = useLocation()

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4 sidebar-wrapper">
            <Link to={'/admin'} className="brand-link">
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
                            <Link to={'/admin'} className={location.pathname === '/admin' || location.pathname.indexOf('social') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-tachometer-alt"></i>
                                <p>Siteconfig</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/admin/buku'} className={location.pathname === '/admin/buku' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-book"></i>
                                <p>Buku</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/admin/artikel'} className={location.pathname.indexOf('/artikel') > -1 || location.pathname.indexOf('/kategori') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-copy"></i>
                                <p>Artikel</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/admin/banner'} className={location.pathname.indexOf('/banner') > -1 ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon fas fa-columns"></i>
                                <p>Banner</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/admin/customer'} className={location.pathname === '/admin/customer' ? 'nav-link active' : 'nav-link'}>
                                <i className="nav-icon far fa-user"></i>
                                <p>Customer</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}
