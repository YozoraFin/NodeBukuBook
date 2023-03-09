import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function EditGenre() {
    const navigate = useNavigate()
    const [genre, setGenre] = useState('')
    const param = useParams()

    const getDetail = () => {
        axios.get('http://localhost:5000/genre/'+param.id).then((res) => {
            setGenre(res.data.data.Genre)
        })
    }

    useEffect(() => {
        getDetail()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const object = {
            Genre: genre
        }
        axios.patch('http://localhost:5000/genre/'+param.id, object).then((res) => {
            const MySwal = withReactContent(Swal)
            if(res.data.status === 200) {
                MySwal.fire({
                    title: 'Genre baru berhasil diperbarui',
                    icon: 'success'
                }).then(() => {
                    navigate('/admin/buku')
                })
            } else {
                MySwal.fire({
                    title: 'Gagal memperbarui genre',
                    text: 'Sepertinya server sedang mengalami masalah, cobalah untuk memperbaruinya lagi nanti',
                    icon: 'error'
                })
            }
        })
    }

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-4">
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Edit Genre</h3>
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
