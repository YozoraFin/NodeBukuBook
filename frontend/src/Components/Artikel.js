import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate';

export default function Artikel() {
    const perPage = 10

    const [artikels, setArtikel] = useState([])
    const [loadingArtikel, setLoadingArtikel] = useState(true)
    const [offsetArtikel, setOffsetArtikel] = useState(0)
    const [pageCountArtikel, setPageCountArtikel] = useState(0)
    const [totalArtikel, setTotalArtikel] = useState(0)

    const [kategori, setKategori] = useState([])
    const [loadingKategori, setLoadingKategori] = useState(true)
    const [offsetKategori, setOffsetKategori] = useState(0)
    const [pageCountKategori, setPageCountKategori] = useState(0)
    const [totalKategori, setTotalKategori] = useState(0)

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

    const handleArtikelPage = (e) => {
        setOffsetArtikel(e.selected*perPage)
    }
    
    const handleKategoriPage = (e) => {
        setOffsetKategori(e.selected*perPage)
    }

    const getArtikel = () => {
        axios.get('http://localhost:5000/artikel').then((res) => {
            const slice = res.data.data?.slice(offsetArtikel, offsetArtikel + perPage)
            setArtikel(slice)
            setPageCountArtikel(Math.ceil(res.data.data?.length / perPage))
            setTotalArtikel(res.data.data?.length)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingArtikel(false)
        })
    }

    const getKategori = () => {
        axios.get('http://localhost:5000/kategori').then((res) => {
            const slice = res.data.data?.slice(offsetKategori, offsetKategori + perPage)
            setKategori(slice)
            setPageCountKategori(Math.ceil(res.data.data?.length / perPage))
            setTotalKategori(res.data.data?.length)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingKategori(false)
        })
    }

    useEffect(() => {
        getKategori()
    }, [offsetKategori])

    useEffect(() => {
        getArtikel()
    }, [offsetArtikel])

    const dataArtikel = loadingArtikel ?
                        (
                            <tr>
                                <td><Skeleton width={20}/></td>
                                <td><Skeleton width={200}/></td>
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
                        artikels?.map((art, index) => {
                            return(
                                <tr key={`artikeltable${index}`}>
                                    <td>{index+1+offsetArtikel}</td>
                                    <td>{art?.Judul}</td>
                                    <td>{art?.Penulis}</td>
                                    <td className='text-center'><Link className='mr-2' to={'/admin/artikel/'+art?.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteArtikel(art?.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></td>
                                </tr>
                            )
                        })

    const dataKategori = loadingKategori ?
                            (
                                <tr>
                                    <td><Skeleton width={20} /></td>
                                    <td><Skeleton width={100} /></td>
                                    <td>
                                        <div className="row">
                                            <div className="col-6 text-right"><Skeleton width={40} height={40}/></div>
                                            <div className="col-6"><Skeleton width={40} height={40}/></div>
                                        </div>
                                    </td>
                                </tr>
                            )
                            :
                            kategori?.map((kat, index) => {
                                return(
                                    <tr key={`tabelkategori${index}`}>
                                        <td>{index+1+offsetKategori}</td>
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
                                <div className="row">
                                    <div className="col-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Judul</th>
                                                    <th>Penulis</th>
                                                    <th><div className='d-flex align-items-end'><span>Opsi</span> <Link className='ml-auto' to={'/admin/artikel/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link></div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataArtikel}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        <div class="dataTables_info" id="example2_info" role="status" aria-live="polite">{totalArtikel > perPage ? `Menampilkan 1 hingga ${perPage} dari ${totalArtikel} Data` : `Menampilkan ${totalArtikel} hasil`}</div>
                                    </div>
                                    <div className="col-7">
                                        <div class="dataTables_paginate paging_simple_numbers" id="example2_paginate">
                                            {totalArtikel > perPage ? 
                                                <ReactPaginate
                                                    containerClassName={"pagination float-right"}
                                                    pageClassName={"page-item user-select-none"}
                                                    pageLinkClassName={"page-link"}
                                                    nextClassName={'page-item user-select-none'}
                                                    pageCount={pageCountArtikel}
                                                    activeClassName={"active"}
                                                    nextLinkClassName={'page-link'}
                                                    previousClassName={'page-item user-select-none'}
                                                    previousLinkClassName={'page-link'}
                                                    onPageChange={handleArtikelPage}
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
                    <div className="col-8">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Kategori
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Kategori</th>
                                                    <th><div className='d-flex align-items-end'><span>Opsi</span> <Link className='ml-auto' to={'/admin/kategori/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link></div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataKategori}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        <div class="dataTables_info" id="example2_info" role="status" aria-live="polite">{totalKategori > perPage ? `Menampilkan 1 hingga ${perPage} dari ${totalKategori} Data` : `Menampilkan ${totalKategori} hasil`}</div>
                                    </div>
                                    <div className="col-7">
                                        <div class="dataTables_paginate paging_simple_numbers" id="example2_paginate">
                                            {totalKategori > perPage ?
                                                <ReactPaginate
                                                    containerClassName={"pagination float-right"}
                                                    pageClassName={"page-item user-select-none"}
                                                    pageLinkClassName={"page-link"}
                                                    nextClassName={'page-item user-select-none'}
                                                    pageCount={pageCountKategori}
                                                    activeClassName={"active"}
                                                    nextLinkClassName={'page-link'}
                                                    previousClassName={'page-item user-select-none'}
                                                    previousLinkClassName={'page-link'}
                                                    onPageChange={handleKategoriPage}
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
