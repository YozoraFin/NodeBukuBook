import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function EditKategori() {
    const [kategori, setKategori] = useState('')
    const navigate = useNavigate()
    const param = useParams()

    const handleSubmit = (e) => {
        e.preventDefault()
        const object = {
            Kategori: kategori
        }
        axios.patch('http://localhost:5000/kategori/'+param.id, object).then((res) => {
            const MySwal = withReactContent(Swal)
            if(res.data.status === 200) {
                MySwal.fire({
                    title: 'Berhasil memperbarui',
                    icon: 'success'
                }).then(() => {
                    navigate('/admin/artikel')
                })
            } else {
                MySwal.fire({
                    title: 'Gagal memperbarui',
                    text: 'Sepertinya server sedang mengalami gangguan, cobalah lagi setelah beberapa saat',
                    icon: 'error'
                })
            }
        })
    }

    const getKategori = () => {
        axios.get(`http://localhost:5000/kategori/${param.id}`).then((res) => {
            setKategori(res?.data?.data?.Kategori)
        })
    }

    useEffect(() => {
        getKategori()
    },[])

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-md-4">
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Edit Kategori</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="Kategori">Kategori</label>
                                        <input required value={kategori} onChange={(e) => {setKategori(e.target.value)}} type="text" className="form-control" id="Kategori" />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary">Perbarui</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
