import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

export default function Artikel() {
    const [artikels, setArtikel] = useState([])
    const [kategori, setKategori] = useState([])
    const [loadingArtikel, setLoadingArtikel] = useState(true)
    const [loadingKategori, setLoadingKategori] = useState(true)

    const handleDeleteKategori = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Setelah anda menghapusnya anda tidak dapat mengembalikannya',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then((res) => {
            if(res.isConfirmed) {
                axios.delete('http://localhost:5000/kategori/'+id).then((res) => {
                    if(res.data.status === 200) {
                        MySwal.fire({
                            title: 'Berhasil dihapus',
                            icon: 'success'
                        }).then(() => {
                            getData()
                        })
                    } else {
                        MySwal.fire({
                            title: 'Gagal menghapus data',
                            text: 'Sepertinya server sedang mengalami beberapa masalah',
                            icon: 'error'
                        })
                    }
                })
            }
        })
    }

    const getData = () => {
        axios.get('http://localhost:5000/article').then((res) => {
            setArtikel(res.data.article)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingArtikel(false)
        })
        axios.get('http://localhost:5000/kategori').then((res) => {
            setKategori(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingKategori(false)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    const dataArtikel = loadingArtikel ?
                        (
                            <tr>
                                <td><Skeleton width={20}/></td>
                                <td><Skeleton width={200}/></td>
                                <td><Skeleton width={200}/></td>
                                <td><Skeleton width={100}/></td>
                            </tr>
                        )
                        :
                        artikels?.map((art, index) => {
                            return(
                                <tr key={`artikeltable${index}`}>
                                    <td>{index+1}</td>
                                    <td>{art?.Judul}</td>
                                    <td>{art?.Penulis}</td>
                                    <td className='text-center'><Link className='mr-2' to={'/admin/artikel/'+art?.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></td>
                                </tr>
                            )
                        })

    const dataKategori = loadingKategori ?
                            (
                                <tr>
                                    <td><Skeleton width={20} /></td>
                                    <td><Skeleton width={100} /></td>
                                    <td><Skeleton width={100} /></td>
                                </tr>
                            )
                            :
                            kategori?.map((kat, index) => {
                                return(
                                    <tr key={`tabelkategori${index}`}>
                                        <td>{index+1}</td>
                                        <td>{kat?.Kategori}</td>
                                        <td className='text-center'><Link className='mr-2' to={'/admin/kategori/'+kat?.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteKategori(kat?.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></td>
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
                                <h3 className="card-title">
                                    Artikel
                                </h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Judul</th>
                                            <th>Penulis</th>
                                            <th className='d-flex align-items-end'><span>Opsi</span> <Link className='ml-auto' to={'/admin/artikel/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataArtikel}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Kategori
                                </h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Kategori</th>
                                            <th className='d-flex align-items-end'><span>Opsi</span> <Link className='ml-auto' to={'/admin/kategori/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataKategori}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
