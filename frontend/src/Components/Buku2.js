import axios from 'axios'
import React, { useEffect, useState } from 'react'
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
    const [offsetBuku, setOffsetBuku] = useState(0)
    const [bukuPageCount, setBukuPageCount] = useState(0)
    const [totalBuku, setTotalBuku] = useState(0)
    const [keywordBuku, setKeywordBuku] = useState('')

    const [genre, setGenre] = useState([])
    const [loadingGenre, setLoadingGenre] = useState(true)
    const [offsetGenre, setOffsetGenre] = useState(0)
    const [genrePageCount, setGenrePageCount] = useState(0)
    const [totalGenre, setTotalGenre] = useState(0)

    const handleBukuClick = (e) => {
        setOffsetBuku(e.selected*perPage)
    }

    const getBuku = (key) => {
        let keyw = key
        if(keyw === undefined) {
            keyw = ''
        }
        axios.get('http://localhost:5000/buku/'+keyw).then((res) => {
            const slice = res?.data?.data?.slice(offsetBuku, offsetBuku+perPage)
            setBuku(slice)
            setBukuPageCount(Math.ceil(res?.data?.data?.length / perPage))
            setTotalBuku(res?.data?.data?.length)
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

    useEffect(() => {
        const keyword = '?keyword='+keywordBuku
        const getKeyword = setTimeout(() => {
            getBuku(keyword)
        }, 500)
        return() => clearTimeout(getKeyword)
    }, [keywordBuku])

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
                            var Gambar
                            if(buk?.Sampul?.length > 0) {
                                Gambar = (<img src={buk?.Sampul[0]?.SrcGambar} height={80} width={60} />)
                            } else {
                                Gambar = (<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6ENpnnhPgDE0BVDsiIAOhl8dbGVE_5vc11w&usqp=CAU' width={60} height={80} />)
                            }
                            return(
                                <tr key={`tablebuku${index}`} className={buk?.Stok === 0 ? 'text-danger' : ''}>
                                    <td>{index+1+offsetBuku}</td>
                                    <td>{Gambar}</td>
                                    <td>{buk?.Judul}</td>
                                    <td>{buk?.Penulis}</td>
                                    <td>{buk?.Genre?.Genre}</td>
                                    <td>Rp {separator(buk?.Harga)}</td>
                                    <td>{buk?.Stok}</td>
                                    <td className='text-center'><Link className='mr-2' to={'/admin/buku/'+buk?.ID}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteBuku(buk?.ID)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></td>
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
                                    <td className='text-center'><Link className='mr-2' to={'/admin/genre/'+gen?.ID}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteGenre(gen?.ID)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></td>
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
                                <div className="row">
                                    <div className="col-9 d-flex align-items-center">
                                        <h3 className="card-title">Buku</h3>
                                    </div>
                                    <div className="col-3">
                                        <form>
                                            <input onChange={(e) => {setKeywordBuku(e.target.value)}} value={keywordBuku} placeholder='Judul, Penulis' type="text" className="form-control float-right" />
                                        </form>
                                    </div>
                                </div>
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
