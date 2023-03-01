import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Banner() {
    const [banner, setBanner] = useState([])
    const [loadingBanner, setLoadingBanner] = useState(true)
    const [offsetBanner, setOffsetBanner] = useState(0)
    const [bannerPageCount, setBannerPageCount] = useState(0)
    const [totalBanner, setTotalBanner] = useState(0)
    const perPage = 10

    const handlePageClick = (e) => {
        setOffsetBanner(e.selected*perPage)
    }

    const getData = () => {
        axios.get('http://localhost:5000/banner').then((res) => {
            const slice = res.data.data?.slice(offsetBanner, offsetBanner + perPage)
            setBanner(slice)
            setBannerPageCount(Math.ceil(res.data.data?.length / perPage))
            setTotalBanner(res.data.data?.length)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingBanner(false)
        })
    }

    const deleteBanner = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Setelah menghapus anda tidak dapat mengembalikannya lagi',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then((res) => {
            if(res.isConfirmed) {
                axios.delete(`http://localhost:5000/banner/${id}`).then((res) => {
                    if(res.data.status === 200) {
                        MySwal.fire({
                            title: 'Data berhasil dihapus',
                            icon: 'success'
                        }).then(() => {
                            getData()
                        })
                    }
                })
            }
        })
    }

    useEffect(() => {
        getData()
    }, [offsetBanner])

    const dataBanner = loadingBanner ?
                        (
                            ''
                        )
                        :
                        banner?.map((ban, index) => {
                            return(
                                <tr key={`tablebanner${index}`}>
                                    <td>{index+1}</td>
                                    <td className='text-center'><img src={ban?.SrcBanner} alt="" className='bannertable'/><br />{ban.NameBanner}</td>
                                    <td>{ban?.Judul}</td>
                                    <td>{ban?.Deskripsi}</td>
                                    <td className='text-center'><Link className='mr-2' to={'/admin/banner/'+ban.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {deleteBanner(ban?.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></td>
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
                                    Banner
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Banner</th>
                                                    <th>Judul</th>
                                                    <th className='w-25'>Deskripsi</th>
                                                    <th className='d-flex align-items-end'><span>Opsi</span> <Link className='ml-auto' to={'/admin/banner/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link> </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataBanner}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        <div class="dataTables_info" id="example2_info" role="status" aria-live="polite">
                                            {totalBanner > 10 ? `Menampilkan 1 hingga 10 dari ${totalBanner} hasil` : `Menampilkan ${totalBanner} hasil`}
                                        </div>
                                    </div>
                                    <div className="col-7">
                                        <div class="dataTables_paginate paging_simple_numbers" id="example2_paginate">
                                            <ReactPaginate
                                                containerClassName={"pagination float-right"}
                                                pageClassName={"page-item user-select-none"}
                                                pageLinkClassName={"page-link"}
                                                nextClassName={'page-item user-select-none'}
                                                pageCount={bannerPageCount}
                                                activeClassName={"active"}
                                                nextLinkClassName={'page-link'}
                                                previousClassName={'page-item user-select-none'}
                                                previousLinkClassName={'page-link'}
                                                onPageChange={handlePageClick}
                                            />
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
