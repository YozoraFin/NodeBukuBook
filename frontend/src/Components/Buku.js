import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Skeleton from 'react-loading-skeleton'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Buku() {
    const perPage = 10
    const separator = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    const [buku, setBuku] = useState([])
    const [loadingBuku, setLoadingBuku] = useState(true)

    const [genre, setGenre] = useState([])
    const [loadingGenre, setLoadingGenre] = useState(true)

    const getBuku = () => {
        axios.get('http://localhost:5000/buku/').then((res) => {
            setBuku(res?.data?.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingBuku(false)
        })
    }

    const handleDeleteBuku = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Apakah anda yakin ingin menghapusnya?',
            text: 'Setelah dihapus buku tidak bisa dikembalikan',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then((res) => {
            if(res.isConfirmed) {
                axios.delete('http://localhost:5000/buku/'+id).then((res) => {
                    if(res.data.status === 200) {
                        MySwal.fire({
                            title: 'Buku berhasil dihapus',
                            icon: 'success'
                        }).then(() => {
                            getBuku()
                        })
                    } else {
                        MySwal.fire({
                            title: 'Gagal menghapus buku',
                            text: 'Sepertinya server sedang mengalami masalah. cobalah untuk menghapusnya nanti',
                            icon: 'error'
                        })
                    }
                })
            }
        })
    }

    const handleDeleteGenre = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Setelah dihapus anda tidak akan bisa mengembalikannya lagi',
            icon: 'error',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Iya'
        }).then((res) => {
            if(res.isConfirmed) {
                axios.delete('http://localhost:5000/genre/'+id).then((res) => {
                    if(res.data.status === 200) {
                        MySwal.fire({
                            title: 'Genre Berhasil dihapus',
                            icon: 'success'
                        }).then(() => {
                            getGenre()
                        })
                    } else {
                        MySwal.fire({
                            title: 'Gagal menghapus genre',
                            text: 'Sepertinya server sedang mengalami masalah, cobalah untuk menghapusnya lagi nanti',
                            icon: 'error'
                        })
                    }
                })
            }
        })
    }

    useEffect(() => {
        getBuku()
    }, [])

    const getGenre = () => {
        axios.get('http://localhost:5000/genre').then((res) => {
            setGenre(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingGenre(false)
        })
    }

    useEffect(() => {
        getGenre()
    }, [])

    const customStyle = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold'
            }
        }
    }

    const columnBuku = [
        {
            name: 'Sampul',
            cell: (buk) => buk?.Sampul?.length > 0 ? <img src={buk?.Sampul[0]?.SrcGambar} height={80} width={60} /> : <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6ENpnnhPgDE0BVDsiIAOhl8dbGVE_5vc11w&usqp=CAU' width={60} height={80} />
        },
        {
            name: 'Judul',
            selector: row => row.Judul,
            sortable: true
        },
        {
            name: 'Genre',
            selector: row => row.Genre.Genre,
            sortable: true
        },
        {
            name: 'Harga',
            cell: row => 'Rp ' + separator(row.Harga),
            sortable: true
        },
        {
            name: 'Stok',
            selector: row => row.Stok,
            sortable: true
        },
        {
            name: 'Opsi',
            cell: (row) => <div className="text-center"><Link className='mr-2' to={'/admin/buku/'+row?.ID}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteBuku(row?.ID)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></div>,
            width: '180px'
        }
    ]

    const columnGenre = [
        {
            name: 'Genre',
            selector: row => row.Genre,
            sortable: true
        },
        {
            name: 'Opsi',
            cell: (row) => <div className="text-center"><Link className='mr-2' to={'/admin/genre/'+row?.ID}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteGenre(row?.ID)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></div>,
            width: '180px'
        }

    ]

    const conditionalStyle = [
        {
            when: row => row.Stok === 0,
            style: {
                color: 'red'
            }
        }
    ]

    return (
        <section className="content content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-12">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">Buku</h3>
                                <Link className='float-right' to={'/admin/buku/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    columns={columnBuku}
                                    data={buku}
                                    customStyles={customStyle}
                                    pagination
                                    progressPending={loadingBuku}
                                    conditionalRowStyles={conditionalStyle}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">Genre</h3>
                                <Link className='float-right' to={'/admin/genre/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    columns={columnGenre}
                                    data={genre}
                                    customStyles={customStyle}
                                    pagination
                                    progressPending={loadingGenre}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
