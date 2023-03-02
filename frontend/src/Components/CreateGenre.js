import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function CreateGenre() {
    const navigate = useNavigate()
    const [genre, setGenre] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const object = {
            Genre: genre
        }
        axios.post('http://localhost:5000/genre', object).then((res) => {
            const MySwal = withReactContent(Swal)
            if(res.data.status === 200) {
                MySwal.fire({
                    title: 'Genre baru berhasil ditambahkan',
                    icon: 'success'
                }).then(() => {
                    navigate('/admin/buku')
                })
            } else {
                MySwal.fire({
                    title: 'Gagal menambahkan genre',
                    text: 'Sepertinya server sedang mengalami masalah, cobalah untuk menambahkannya lagi nanti',
                    icon: 'error'
                })
            }
        })
    }

    return (
        <section className="content content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-4">
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">Buat Genre</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="genreinput">Genre</label>
                                        <input value={genre} onChange={(e) => {setGenre(e.target.value)}} required type="text" className="form-control" id="genreinput" />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary float-right">Kirim</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
