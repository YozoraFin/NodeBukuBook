import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ContentState, EditorState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { convertToHTML } from 'draft-convert';
import { Link } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
import DataTable from 'react-data-table-component';

export default function SiteConfig() {
    const [tentang, setTentang] = useState(EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML('<p></p>')
        )
    ))
    const [email, setEmail] = useState('')
    const [map, setMap] = useState('')
    const [notelp, setNotelp] = useState('')
    const [alamat, setAlamat] = useState('')
    const [socialData, setSocialData] = useState([])
    const [loadingSocial, setLoadingSocial] = useState(true)

    const handleSubmit = (e) => {
        e.preventDefault()
        let html = convertToHTML(tentang.getCurrentContent())
        var formData = new FormData(e.target)
        formData.append('Tentang', html)
        const object = {
            Tentang: html,
            Map: map,
            NoTELP: notelp,
            Alamat: alamat,
            Email: email
        }
        axios.patch('http://localhost:5000/siteconfig/1', object).then((res) => {
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: 'Berhasil memperbarui data',
                icon: 'success'
            })
        })
    }   

    const handleDeletSocial = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Apakah anda yakin ingin menghapusnya?',
            text: 'Setelah dihapus data akan benar benar hilang dan tidak bisa dikembalikan',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then((res) => {
            if(res.isConfirmed) {
                axios.delete(`http://localhost:5000/social/${id}`).then(() => {
                    MySwal.fire({
                        title: 'Berhasil di hapus',
                        icon: 'success'
                    }).then(() => {
                        getData()
                    })
                })
            }
        })
    } 

    const getData = () => {
        axios.get('http://localhost:5000/siteconfig').then((res) => {
            setAlamat(res?.data?.data?.Alamat)
            setEmail(res?.data?.data?.Email)
            setMap(res?.data?.data?.Map)
            setNotelp(res?.data?.data?.NoTELP)
            setTentang(EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  convertFromHTML(res?.data?.data?.Tentang)
                )
              ))
        })
    }

    const getSocial = () => {
        axios.get('http://localhost:5000/social').then((res) => {
            setSocialData(res.data.data)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoadingSocial(false)
        })
    }

    useEffect(() => {
        getSocial()
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const columnSocial = [
        {
            name: 'Icon',
            selector: row => <h3 dangerouslySetInnerHTML={{ __html: row.Icon }}></h3>
        },
        {
            name: 'Nama',
            selector: row => row.Nama,
            sortable: true
        },
        {
            name: 'Link',
            selector: row => row.Link,
        },
        {
            name: 'Opsi',
            selector: row => <div className="text-center"><Link to={`/admin/social/${row.id}`} className='mr-2'><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeletSocial(row.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></div>,
            width: '180px'
        }
    ]

    const customStyle = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold'
            }
        }
    }

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-12">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">SiteConfig</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="Alamat">Alamat</label>
                                                <input onChange={(e) => {setAlamat(e.target.value)}} type="text" value={alamat} id='Alamat' className='form-control' name='Alamat' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="NoTelp">No HP</label>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <input onChange={(e) => {setNotelp(e.target.value)}} value={notelp} type="text" id='NoTelp' className='form-control' name='NoTELP' />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Email">Email</label>
                                                <input onChange={(e) => {setEmail(e.target.value)}} value={email} type="text" id='Email' className='form-control' name='Email' />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Map">Map</label>
                                                <textarea onChange={(e) => {setMap(e.target.value)}} value={map} name="Map" id="Map" cols="30" rows="5" className='form-control'></textarea>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="summernote">Tentang</label>
                                                <Editor
                                                    editorClassName='form-control'
                                                    editorState={tentang}
                                                    onEditorStateChange={setTentang}
                                                    editorStyle={{ height: '280px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary float-right" type='submit'>Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">Media Social</h3>
                                <Link className='float-right' to={'/admin/social/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    columns={columnSocial}
                                    data={socialData}
                                    customStyles={customStyle}
                                    pagination
                                    progressPending={loadingSocial}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
