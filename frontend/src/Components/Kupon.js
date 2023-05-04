import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Kupon() {
    const separator = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    const [kupon, setKupon] = useState([])
    const [loadingKupon, setLoadingKupon] = useState(true)

    const handleDeletKupon = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Setelah dihapus kupon tidak dapat dikembalikan',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then((res) => {
            if(res.isConfirmed) {
                axios.delete('http://localhost:5000/kupon/'+id).then(() => {
                    MySwal.fire({
                        title: 'Berhasil menghapus kupon',
                        icon: 'success'
                    }).then(() => {
                        getKupon()
                    })
                })
            }
        })
    }

    const getKupon = () => {
        axios.post('http://localhost:5000/kupon/admin', {Pass: process.env.REACT_APP_SECRET_ADMIN}).then((res) => {
            setKupon(res?.data?.data)
            console.log(res.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingKupon(false)
        })
    }

    useEffect(() => {
        getKupon()
    }, [])

    const customStyle = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold'
            }
        }
    }
    console.log(kupon)

    const columnKupon = [
        {
            name: 'Banner',
            cell: kup => <img className='my-2 banner-kupon-table' src={kup?.SrcGambar !== '' ? kup?.SrcGambar : 'http://127.0.0.1:5000/foto/kupon/SrcGambar-1680162638483.png'} alt="" />
        },
        {
            name: 'Judul',
            cell: kup => kup?.Judul
        },
        {
            name: 'Kode',
            cell: kup => kup?.Kode
        },
        {
            name: 'Tipe',
            cell: kup => kup?.Tipe ? 'Persen' : 'Rupiah'
        },
        {
            name: 'Potongan',
            cell: kup => kup?.Tipe ? `${kup?.Potongan}%` : `Rp ${separator(kup?.Potongan)}`
        },
        {
            name: 'Opsi',
            cell: (kup) => <div className="text-center"><Link className='mr-2' to={'/admin/kupon/'+kup?.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeletKupon(kup?.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></div>,
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
                                <h3 className="card-title">Kupon</h3>
                                <Link className='float-right' to={'/admin/kupon/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    columns={columnKupon}
                                    data={kupon}
                                    customStyles={customStyle}
                                    pagination
                                    progressPending={loadingKupon}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
