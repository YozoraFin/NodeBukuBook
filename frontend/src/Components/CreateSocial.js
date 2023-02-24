import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function CreateSocial() {
    const [namaSocial, setNamaSocial] = useState('')
    const [iconSocial, setIconSocial] = useState('')
    const [linkSocial, setLinkSocial] = useState('')
    const navigate = useNavigate()

    const handleUpdate = (e) => {
        e.preventDefault()
        var object = {
            Nama: namaSocial,
            Link: linkSocial,
            Icon: iconSocial
        }
        axios.post(`http://localhost:5000/social`, object).then(() => {
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: 'Berhasil dibuat',
                icon: 'success'
            }).then(() => {
                navigate('/admin')
            })
        })
    }

    return (
        <section className="content content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 pl-3">
                    <div className="col-md-4">
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">Buat</h3>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="Nama">Nama</label>
                                        <input required onChange={(e) => {setNamaSocial(e.target.value)}} value={namaSocial} type="text" className='form-control' id='Nama'/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Icon">Icon (<a className='text-info' target={'__blank'} href="https://fontawesome.com">fontawesome.com</a>)</label>
                                        <input required onChange={(e) => {setIconSocial(e.target.value)}} value={iconSocial} type="text" className="form-control" id='Icon'/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Link">Link</label>
                                        <input required onChange={(e) => {setLinkSocial(e.target.value)}} value={linkSocial} type="text" className="form-control" id='Link' />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary float-right">Tambahkan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
