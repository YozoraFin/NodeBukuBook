import React from 'react'

export default function Header() {
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
            <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" href='?'><i className="fas fa-bars"></i></a>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
                <a href="index3.html" className="nav-link">Beranda</a>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
                <a href="?" className="nav-link">Keluar</a>
            </li>
            </ul>

            <ul className="navbar-nav ml-auto">

            <li className="nav-item">
                <a className="nav-link" data-widget="fullscreen" href="?" role="button">
                <i className="fas fa-expand-arrows-alt"></i>
                </a>
            </li>
            </ul>
        </nav>
    )
}
