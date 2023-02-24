import React from 'react'
import {Link, useNavigate} from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate()
    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.setItem('expired', 0)
        navigate('/login')
    }

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light sticky-top">
            <ul className="navbar-nav">
            <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" href='?'><i className="fas fa-bars"></i></a>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
                <Link to={'/admin'} className="nav-link">Beranda</Link>
            </li>
            </ul>

            <ul className="navbar-nav ml-auto">
                <li className="nav-item d-none d-sm-inline-block">
                    <Link onClick={handleLogout} href="?" className="nav-link"><i class="fa-solid fa-power-off"></i></Link>
                </li>
            </ul>
        </nav>
    )
}
