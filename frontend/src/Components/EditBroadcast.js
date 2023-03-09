import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function EditBroadcast() {
    const [judul, setJudul] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const navigate = useNavigate()
    const param = useParams()

    const handleSubmit = (e) => {
        const MySwal = withReactContent(Swal)
        e.preventDefault()
        const object = {
            Judul: document.getElementById('judulbc').value,
            Konten: document.getElementById('kontenbc').value
        }
        axios.patch('http://localhost:5000/broadcast/'+param.id, object).then((res) => {
            if(res.data.status === 200) {
                MySwal.fire({
                    title: 'Berhasil menambahkan broadcast',
                    icon: 'success'
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

    const handleKirim = () => {
        const object = {
            id: param.id
        }
        axios.post('http://localhost:5000/broadcast/send', object)
    }

    const getData = () => {
        axios.get('http://localhost:5000/broadcast/'+param.id).then((res) => {
            setJudul(res.data.data.Judul)
            setDeskripsi(res.data.data.Konten)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-6">
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Edit Broadcast
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="judulbc">Judul</label>
                                        <input value={judul} onChange={(e) => {setJudul(e.target.value)}} type="text" id='judulbc' className='form-control' placeholder='Judul' />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="kontenbc">Deskripsi</label>
                                        <textarea value={deskripsi} onChange={(e) => {setDeskripsi(e.target.value)}} placeholder='Deskripsi' name="kontenbc" id="kontenbc" cols="30" rows="10" className='form-control'></textarea>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="btn-group">
                                        <button className="btn btn-primary float-right">Simpan</button>
                                        <button onClick={handleKirim} type='button' className="btn btn-success float-left">Kirim <i className="fa-solid fa-paper-plane"></i></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
