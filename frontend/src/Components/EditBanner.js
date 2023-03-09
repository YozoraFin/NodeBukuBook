import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function EditBanner() {
    const [fileUrl, setFileUrl] = useState('')
    const [judul, setJudul] = useState('')
    const [fileName, setFileName] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const navigate = useNavigate()
    const param = useParams()

    const handleFileChange = (e) => {
        setFileName(e.target.files[0].name)
        setFileUrl(URL.createObjectURL(e.target.files[0]))
    }

    const getData = () => {
        axios.get(`http://localhost:5000/banner/${param.id}`).then((res) => {
            setJudul(res?.data?.data?.Judul)
            setFileUrl(res?.data.data?.SrcBanner)
            setDeskripsi(res?.data?.data?.Deskripsi)
            setFileName(res?.data?.data?.NameBanner)
        })
    }

    
    const handleSubmit = (e) => {
        e.preventDefault()
        var formData = new FormData(e.target)
        formData.append('NameBanner', fileName)
        axios.patch('http://localhost:5000/banner/'+param.id, formData).then((res) => {
            const MySwal = withReactContent(Swal)
            if(res.data.status === 200) {
                MySwal.fire({
                    title: 'Berhasil memperbarui',
                    icon: 'success'
                }).then(() => {
                    navigate('/admin/banner')
                })
            } else {
                MySwal.fire({
                    title: 'Gagal memperbarui',
                    text: 'Sepertinya server sedang mengalami masalah, cobalah lagi setelah beberapa saat',
                    icon: 'error'
                })
            }
        })
    }
    useEffect(() => {
        getData()
    }, [])
    
    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-md-6">
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Edit Banner</h3>
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
                                                <input name='banner' onChange={handleFileChange} type="file" className="custom-file-input" id="Banner" />
                                                <label htmlFor="Banner" className="custom-file-label">{fileName === '' ? 'Pilih file' : fileName}</label>
                                            </div>
                                        </div>
                                    </div>
                                    {fileUrl === '' ? '' : <img src={fileUrl} alt="" width={150} height={200} />}
                                    <div className="form-group mt-3">
                                        <label htmlFor="Deskripsi">Deskripsi</label>
                                        <textarea required onChange={(e) => {setDeskripsi(e.target.value)}} value={deskripsi} name="Deskripsi" id="Deskripsi" cols="30" rows="10" className="form-control"></textarea>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary float-right">Perbarui</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
