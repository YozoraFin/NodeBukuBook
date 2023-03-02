import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'

export default function Buku() {
    const perPage = 10
    const separator = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    const [buku, setBuku] = useState([])
    const [loadingBuku, setLoadingBuku] = useState(true)
    const [offsetBuku, setOffsetBuku] = useState(0)
    const [bukuPageCount, setBukuPageCount] = useState(0)
    const [totalBuku, setTotalBuku] = useState(0)

    const [genre, setGenre] = useState([])
    const [loadingGenre, setLoadingGenre] = useState(true)
    const [offsetGenre, setOffsetGenre] = useState(0)
    const [genrePageCount, setGenrePageCount] = useState(0)
    const [totalGenre, setTotalGenre] = useState(0)

    const handleBukuClick = (e) => {
        setOffsetBuku(e.selected*perPage)
    }

    const getBuku = () => {
        axios.get('http://localhost:5000/buku').then((res) => {
            const slice = res.data.data?.slice(offsetBuku, offsetBuku+perPage)
            setBuku(slice)
            setBukuPageCount(Math.ceil(res.data.data?.length / perPage))
            setTotalBuku(res.data.data?.length)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingBuku(false)
        })
    }

    useEffect(() => {
        getBuku()
    }, [offsetBuku])

    const handleGenreClick = (e) => {
        setOffsetGenre(e.selected*perPage)
    }

    const getGenre = () => {
        axios.get('http://localhost:5000/genre').then((res) => {
            const slice = res.data.data?.slice(offsetGenre, offsetGenre + perPage)
            setGenre(slice)
            setGenrePageCount(Math.ceil(res.data.data?.length / perPage))
            setTotalGenre(res.data.data?.length)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingGenre(false)
        })
    }

    useEffect(() => {
        getGenre()
    }, [offsetGenre])

    const dataBuku = loadingBuku ?
                        (
                            <tr>
                                <td><Skeleton width={20}/></td>
                                <td><Skeleton width={90} height={120}/></td>
                                <td><Skeleton width={200} /></td>
                                <td><Skeleton width={150} /></td>
                                <td><Skeleton width={75} /></td>
                                <td><Skeleton width={75} /></td>
                                <td><Skeleton width={25} /></td>
                                <td>
                                    <div className="row">
                                        <div className="col-6 text-right"><Skeleton width={40} height={40}/></div>
                                        <div className="col-6"><Skeleton width={40} height={40}/></div>
                                    </div>
                                </td>
                            </tr>
                        )
                        :
                        buku?.map((buk, index) => {
                            return(
                                <tr key={`tablebuku${index}`} className={buk?.Stok === 0 ? 'text-danger' : ''}>
                                    <td>{index+1+offsetBuku}</td>
                                    <td>gambar</td>
                                    <td>{buk?.Judul}</td>
                                    <td>{buk?.Penulis}</td>
                                    <td>{buk?.Genre.Genre}</td>
                                    <td>Rp {separator(buk?.Harga)}</td>
                                    <td>{buk?.Stok}</td>
                                    <td className='text-center'><Link className='mr-2' to={'/admin/buku/'+buk?.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></td>
                                </tr>
                            )
                        })
    const dataGenre = loadingGenre ?
                        (
                            <tr>
                                <td><Skeleton width={20}/></td>
                                <td><Skeleton width={100}/></td>
                                <td>
                                    <div className="row">
                                        <div className="col-6 text-right"><Skeleton width={40} height={40}/></div>
                                        <div className="col-6"><Skeleton width={40} height={40}/></div>
                                    </div>
                                </td>
                            </tr>
                        )
                        :
                        genre?.map((gen, index) => {
                            return(
                                <tr>
                                    <td>{index+1+offsetGenre}</td>
                                    <td>{gen.Genre}</td>
                                    <td className='text-center'><Link className='mr-2' to={'/admin/genre/'+gen?.ID}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></td>
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
                                <h3 className="card-title">Buku</h3>
                            </div>
                            <div className="card-body">
                                <div className='row'>
                                    <div className="col-12 table-responsive">
                                        <table className="table table-hover table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Sampul</th>
                                                    <th>Judul</th>
                                                    <th>Penulis</th>
                                                    <th>Genre</th>
                                                    <th>Harga</th>
                                                    <th>Stok</th>
                                                    <th><div className='d-flex align-items-end'><span>Opsi</span> <Link className='ml-auto' to={'/admin/buku/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link></div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataBuku}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        <div class="dataTables_info" id="example2_info" role="status" aria-live="polite">{totalBuku > perPage ? `Menampilkan 1 hingga ${perPage} dari ${totalBuku} Data` : `Menampilkan ${totalBuku} hasil`}</div>
                                    </div>
                                    <div className="col-7">
                                            {totalBuku > perPage ? 
                                                <ReactPaginate
                                                    containerClassName={"pagination float-right"}
                                                    pageClassName={"page-item user-select-none"}
                                                    pageLinkClassName={"page-link"}
                                                    nextClassName={'page-item user-select-none'}
                                                    pageCount={bukuPageCount}
                                                    activeClassName={"active"}
                                                    nextLinkClassName={'page-link'}
                                                    previousClassName={'page-item user-select-none'}
                                                    previousLinkClassName={'page-link'}
                                                    onPageChange={handleBukuClick}
                                                />
                                                :
                                                ''
                                            }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">Genre</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 table-responsive">
                                        <table className="table table-hover table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Genre</th>
                                                    <th><div className='d-flex align-items-end'><span>Opsi</span> <Link className='ml-auto' to={'/admin/genre/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link></div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataGenre}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        <div class="dataTables_info" id="example2_info" role="status" aria-live="polite">{totalGenre > perPage ? `Menampilkan 1 hingga ${perPage} dari ${totalGenre} Data` : `Menampilkan ${totalGenre} hasil`}</div>
                                    </div>
                                    <div className="col-7">
                                            {totalGenre > perPage ? 
                                                <ReactPaginate
                                                    containerClassName={"pagination float-right"}
                                                    pageClassName={"page-item user-select-none"}
                                                    pageLinkClassName={"page-link"}
                                                    nextClassName={'page-item user-select-none'}
                                                    pageCount={genrePageCount}
                                                    activeClassName={"active"}
                                                    nextLinkClassName={'page-link'}
                                                    previousClassName={'page-item user-select-none'}
                                                    previousLinkClassName={'page-link'}
                                                    onPageChange={handleGenreClick}
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
        </section>
    )
}
