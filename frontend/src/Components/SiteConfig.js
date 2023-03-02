import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ContentState, EditorState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { convertToHTML } from 'draft-convert';
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
import ReactPaginate from 'react-paginate';

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
    const [offsetSocial, setOffsetSocial] = useState(0)
    const [totalSocial, setTotalSocial] = useState(0)
    const [socialCount, setSocialCount] = useState(0)
    const perPage = 10

    const handlePageSocial = (e) => {
        setOffsetSocial(e.selected*perPage)
    }

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
            const slice = res.data.data?.slice(offsetSocial, offsetSocial+perPage)
            setSocialData(slice)
            setSocialCount(Math.ceil(res.data.data?.length / perPage))
            setTotalSocial(res.data.data?.length)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoadingSocial(false)
        })
    }

    useEffect(() => {
        getSocial()
    }, [offsetSocial])

    useEffect(() => {
        getData()
    }, [])

    const socialtable = loadingSocial ?
                        (
                            <tr>
                                <td><Skeleton width={20}/></td>
                                <td><Skeleton width={50}/></td>
                                <td><Skeleton width={100}/></td>
                                <td><Skeleton width={200}/></td>
                                <td>
                                    <div className="row">
                                        <div className="col-6 text-right"><Skeleton width={40} height={40}/></div>
                                        <div className="col-6"><Skeleton width={40} height={40}/></div>
                                    </div>
                                </td>
                            </tr>
                        )
                        :
                        socialData?.map((soc, index) => {
                            return(
                                <tr key={`social${index}`}>
                                    <td>{index + 1 + offsetSocial}</td>
                                    <td><h3 dangerouslySetInnerHTML={{ __html: soc.Icon }}></h3></td>
                                    <td>{soc.Nama}</td>
                                    <td>{soc.Link}</td>
                                    <th className='text-center'><Link to={`/admin/social/${soc.id}`} className='mr-2'><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeletSocial(soc.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></th>
                                </tr>
                            )
                        })

    return (
        <section className="content content-wrapper">
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
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Icon</th>
                                                    <th>Nama</th>
                                                    <th>Link</th>
                                                    <th><div className='d-flex align-items-end'><span>Opsi</span> <Link className='ml-auto' to={'/admin/social/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link></div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {socialtable}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        <div class="dataTables_info" id="example2_info" role="status" aria-live="polite">
                                            {totalSocial > perPage ? `Menampilkan 1 hingga ${perPage} dari ${totalSocial} hasil` : `Menampilkan ${totalSocial} hasil`}
                                        </div>
                                    </div>
                                    <div className="col-7">
                                        <div class="dataTables_paginate paging_simple_numbers" id="example2_paginate">
                                            {totalSocial > perPage ?
                                                <ReactPaginate
                                                    containerClassName={"pagination float-right"}
                                                    pageClassName={"page-item user-select-none"}
                                                    pageLinkClassName={"page-link"}
                                                    nextClassName={'page-item user-select-none'}
                                                    pageCount={socialCount}
                                                    activeClassName={"active"}
                                                    nextLinkClassName={'page-link'}
                                                    previousClassName={'page-item user-select-none'}
                                                    previousLinkClassName={'page-link'}
                                                    onPageChange={handlePageSocial}
                                                />
                                                :
                                                ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
