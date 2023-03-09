import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function CreateKategori() {
    const [kategori, setKategori] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const object = {
            Kategori: kategori
        }
        axios.post('http://localhost:5000/kategori', object).then((res) => {
            const MySwal = withReactContent(Swal)
            if(res.data.status === 200) {
                MySwal.fire({
                    title: 'Berhasil menambahkan',
                    icon: 'success'
                }).then(() => {
                    navigate('/admin/artikel')
                })
            } else {
                MySwal.fire({
                    title: 'Gagal menambahkan',
                    text: 'Sepertinya server sedang mengalami gangguan, cobalah lagi setelah beberapa saat',
                    icon: 'error'
                })
            }
        })
    }

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-md-4">
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">Tambahkan Kategori</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="Kategori">Kategori</label>
                                        <input placeholder='Kategori' required value={kategori} onChange={(e) => {setKategori(e.target.value)}} type="text" className="form-control" id="Kategori" />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary">Tambahkan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
