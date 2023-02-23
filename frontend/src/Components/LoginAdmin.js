import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginAdmin() {
    const [errorPass, setErrorPass] = useState('')
    const navigate = useNavigate()
    const d = new Date()

    const handleSubmit = (e) => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const pass = document.getElementById('pass').value
        const rember = document.getElementById('remember').checked

        if(email === 'emailstatis@gmail.com' && pass === 'passwordstatis' ) {
            navigate('/admin')
            if(rember) {
                localStorage.setItem('expired', d.getTime() + 1000*60*60*24*7)
            }
        } else {
            setErrorPass('Password atau email yang dimasukkan salah')
        }
    }

    return (
        <div className="hold-transition login-page">
            <div className="login-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <a href="../../index2.html" className="h1"><b>Buku</b>Book</a>
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg">Masuk</p>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Email" id='email'/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" className="form-control" placeholder="Password" id='pass'/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-danger'>{errorPass}</p>
                            <div className="row">
                                <div className="col-8">
                                    <div class="icheck-primary">
                                        <input type="checkbox" id="remember"/>
                                        <label for="remember">
                                            Remember Me
                                        </label>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary btn-block">Masuk</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
