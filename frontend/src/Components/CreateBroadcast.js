import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function CreateBroadcast() {
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        const MySwal = withReactContent(Swal)
        e.preventDefault()
        const object = {
            Judul: document.getElementById('judulbc').value,
            Konten: document.getElementById('kontenbc').value
        }
        axios.post('http://localhost:5000/broadcast', object).then((res) => {
            if(res.data.status === 200) {
                MySwal.fire({
                    title: 'Berhasil menambahkan broadcast',
                    icon: 'success'
                }).then(() => {
                    navigate('/admin/broadcast')
                })
            } else {
                MySwal.fire({
                    title: 'Gagal menambahkan broadcast',
                    icon: 'error',
                    text: res.data.message
                })
            }
        })
    }

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-6">
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Buat Broadcast
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="judulbc">Judul</label>
                                        <input type="text" id='judulbc' className='form-control' placeholder='Judul' />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="kontenbc">Deskripsi</label>
                                        <textarea placeholder='Deskripsi' name="kontenbc" id="kontenbc" cols="30" rows="10" className='form-control'></textarea>
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
