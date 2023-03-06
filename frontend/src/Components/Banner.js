import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Skeleton from 'react-loading-skeleton'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Banner() {
    const [banner, setBanner] = useState([])
    const [loadingBanner, setLoadingBanner] = useState(true)
    const perPage = 10

    const getData = () => {
        axios.get('http://localhost:5000/banner').then((res) => {
            setBanner(res.data.data)
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
    }, [])

    const customStyle = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold'
            }
        }
    }
    
    const columnBanner = [
        {
            name: 'Banner',
            selector: row => <div className="text-center"><img src={row?.SrcBanner} alt="" className='bannertable'/><br />{row.NameBanner}</div>
        },
        {
            name: 'Judul',
            selector: row => row?.Judul,
            sortable: true
        },
        {
            name: 'Deskripsi',
            selector: row => row?.Deskripsi,
            sortable: true
        },
        {
            name: 'Opsi',
            selector: row => <div><Link className='mr-2' to={'/admin/banner/'+row.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {deleteBanner(row?.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></div>,
            width: '180px'
        },
    ]

    return (
        <section className="content content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-12">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">Banner</h3>
                                <Link className='float-right' to={'/admin/banner/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    columns={columnBanner}
                                    data={banner}
                                    customStyles={customStyle}
                                    pagination
                                    progressPending={loadingBanner}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
