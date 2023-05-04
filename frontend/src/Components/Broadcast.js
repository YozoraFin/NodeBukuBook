import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

export default function Broadcast() {
    const [broadcast, setBroadcast] = useState([])
    const [loadingBroadcast, setLoadingBroadcast] = useState(true)

    const handleDeleteBroadcast = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Apakah anda yakin?',
            text: 'Setelah dihapus anda tidak dapat mengembalikannya lagi',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Ya'
        }).then((res) => {
            if(res.isConfirmed) {
                axios.delete('http://localhost:5000/broadcast/'+id).then((res) => {
                    if(res.data.status === 200) {
                        MySwal.fire({
                            title: 'Berhasil dihapus',
                            icon: 'success'
                        }).then(() => {
                            getData()
                        })
                    }
                })
            }
        })
    }

    const getData = () => {
        axios.get('http://localhost:5000/broadcast').then((res) => {
            setBroadcast(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingBroadcast(false)
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

    const broadcastcolumn = [
        {
            name: 'Judul',
            selector: row => row.Judul,
            width: '200px',
            sortable: true
        },
        {
            name: 'Deskripsi',
            selector: row => row.Konten,
            sortable: true,
            width: '690px',
        },
        {
            name: 'Opsi',
            cell: (row) => <div className="text-center my-3"><Link className='mr-2' to={'/admin/broadcast/'+row?.id}><button className="btn btn-primary"><i className="fa-solid fa-pen"></i></button></Link><button onClick={() => {handleDeleteBroadcast(row?.id)}} className="btn btn-danger ml-2"><i className="fa-solid fa-trash"></i></button></div>,
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
                                    Broadcast
                                </h3>
                                <Link className='float-right' to={'/admin/broadcast/create'}><button className="btn btn-success"><i className="fa-solid fa-plus"></i></button></Link>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    columns={broadcastcolumn}
                                    data={broadcast}
                                    progressPending={loadingBroadcast}
                                    pagination
                                    customStyles={customStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
