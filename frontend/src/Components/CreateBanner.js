import React, { useState } from 'react'
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function CreateBanner() {
    const [fileUrl, setFileUrl] = useState('')
    const [judul, setJudul] = useState('')
    const [fileName, setFileName] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        setFileName(e.target.files[0].name)
        setFileUrl(URL.createObjectURL(e.target.files[0]))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        var formData = new FormData(e.target)
        formData.append('NameBanner', fileName)
        axios.post('http://localhost:5000/banner', formData).then((res) => {
            const MySwal = withReactContent(Swal)
            if(res.data.status === 200) {
                MySwal.fire({
                    title: 'Berhasil menambahkan',
                    icon: 'success'
                }).then(() => {
                    navigate('/admin/banner')
                })
            } else {
                MySwal.fire({
                    title: 'Gagal menambahkan',
                    text: 'Sepertinya server sedang mengalami masalah, cobalah lagi setelah beberapa saat',
                    icon: 'error'
                })
            }
        })
    }

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-md-6">
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">Tambahkan Banner</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="Judul">Judul</label>
                                        <div className="row">
                                            <div className="col-6">
                                                <input name='Judul' required onChange={(e) => {setJudul(e.target.value)}} value={judul} type="text" id="Judul" className="form-control" placeholder='Judul'/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="Banner">Banner</label>
                                        <div className="input-group">
                                            <div className="custom-file">
                                                <input name='banner' required onChange={handleFileChange} type="file" className="custom-file-input" id="Banner" multiple />
                                                <label htmlFor="Banner" className="custom-file-label">{fileName === '' ? 'Pilih file' : fileName}</label>
                                            </div>
                                        </div>
                                    </div>
                                    {fileUrl === '' ? '' : <img src={fileUrl} alt="" width={150} height={200} />}
                                    <div className="form-group mt-3">
                                        <label htmlFor="Deskripsi">Deskripsi</label>
                                        <textarea placeholder='Deskripsi' required onChange={(e) => {setDeskripsi(e.target.value)}} value={deskripsi} name="Deskripsi" id="Deskripsi" cols="30" rows="10" className="form-control"></textarea>
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
