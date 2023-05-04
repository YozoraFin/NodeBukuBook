import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate';
import DataTable from 'react-data-table-component';

export default function Artikel() {
    const perPage = 10

    const [artikels, setArtikel] = useState([])
    const [loadingArtikel, setLoadingArtikel] = useState(true)

    const [kategori, setKategori] = useState([])
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
                            getKategori()
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

    const handleDeleteArtikel = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Setelah anda menghapusnya anda tidak bisa mengembalikannya',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then((res) => {
            if(res.isConfirmed) {
                axios.delete('http://localhost:5000/artikel/'+id).then((resv) => {
                    if(resv.data.status === 200) {
                        MySwal.fire({
                            title: 'Data berhasil dihapus',
                            icon: 'success'
                        }).then(() => {
                            getArtikel()
                        })
                    } else {
                        MySwal.fire({
                            title: 'Gagal menghapus',
                            text: 'Sepertinya server sedang mengalami gangguan',
                            icon: 'error'
                        })
                    }
                })
            }
        })
    }

    const getArtikel = () => {
        axios.get('http://localhost:5000/artikel').then((res) => {
            setArtikel(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingArtikel(false)
        })
    }

    const getKategori = () => {
        axios.get('http://localhost:5000/kategori').then((res) => {
            setKategori(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingKategori(false)
        })
    }

    useEffect(() => {
        getKategori()
    }, [])

    useEffect(() => {
        getArtikel()
    }, [])

    const customStyle = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold'
            }
        }
    }

    const columnArtikel = [
        {
            name: 'Judul',
            selector: row => row.Judul,
            sortable: true,
        },
        {
            name: 'Penulis',
            selector: row => row.Penulis,
            sortable: true
        },
        {
            name: 'Opsi',
            cell: (row) => <div className="text-center my-3"><Link className='mr-2' to={'/admin/artikel/'+row?.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteArtikel(row?.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></div>,
            width: '180px'
        }
    ]

    const columnKategori = [
        {
            name: 'Kategori',
            selector: row => row.Kategori,
            sortable: true
        },
        {
            name: 'Opsi',
            cell: (row) => <div className="text-center my-3"><Link className='mr-2' to={'/admin/kategori/'+row?.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteKategori(row?.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></div>,
            width: '180px'
        }

    ]

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-12">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Artikel
                                </h3>
                                <Link className='float-right' to={'/admin/artikel/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    columns={columnArtikel}
                                    data={artikels}
                                    pagination
                                    customStyles={customStyle}
                                    progressPending={loadingArtikel}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Kategori
                                </h3>
                                <Link className='float-right' to={'/admin/kategori/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    data={kategori}
                                    columns={columnKategori}
                                    pagination
                                    customStyles={customStyle}
                                    progressPending={loadingKategori}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
