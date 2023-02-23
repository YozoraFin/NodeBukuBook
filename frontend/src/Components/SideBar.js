import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function SideBar() {
    const location = useLocation()

    return (
        <aside class="main-sidebar sidebar-dark-primary elevation-4 sidebar-wrapper">
            <Link to={'/admin'} class="brand-link">
                <img src="/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{ opacity: ".8" }}/>
                <span class="brand-text font-weight-light">BukuBook Admin</span>
            </Link>

            <div class="sidebar">
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image">
                        <img src="/dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User"/>
                    </div>
                    <div class="info">
                        <a href='?'>Steven</a>
                    </div>
                </div>

                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li class="nav-item">
                            <Link to={'/admin'} class={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}>
                                <i class="nav-icon fas fa-tachometer-alt"></i>
                                <p>Siteconfig</p>
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to={'/admin/buku'} class={location.pathname === '/admin/buku' ? 'nav-link active' : 'nav-link'}>
                                <i class="nav-icon fas fa-book"></i>
                                <p>Buku</p>
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to={'/admin/artikel'} class={location.pathname === '/admin/artikel' ? 'nav-link active' : 'nav-link'}>
                                <i class="nav-icon fas fa-copy"></i>
                                <p>Artikel</p>
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to={'/admin/banner'} class={location.pathname === '/admin/banner' ? 'nav-link active' : 'nav-link'}>
                                <i class="nav-icon fas fa-columns"></i>
                                <p>Banner</p>
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to={'/admin/customer'} class={location.pathname === '/admin/customer' ? 'nav-link active' : 'nav-link'}>
                                <i class="nav-icon far fa-user"></i>
                                <p>Customer</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}
