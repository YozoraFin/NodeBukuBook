import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'

export default function Order() {
    const [order, setOrder] = useState([])
    const [loadingOrder, setLoadingOrder] = useState(true)
    const separator = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    const getData = () => {
        const object = {
            Pass: process.env.REACT_APP_SECRET_ADMIN
        }
        axios.post('http://localhost:5000/order/admin', object).then((res) => {
            setOrder(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingOrder(false)
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

    const columnOrder = [
        {
            name: 'Nama',
            selector: row => row.Nama,
            sortable: true
        },
        {
            name: 'Invoice',
            selector: row => row.Invoice,
            sortable: true
        },
        {
            name: 'Tanggal',
            selector: row => row.Tanggal
        },
        {
            name: 'Total',
            selector: row => `Rp `+separator(row.Total)
        },
        {
            name: 'Opsi',
            cell: (row) => <div className="text-center my-3"><Link className='mr-2' to={'/admin/order/'+row?.ID}><button className="btn btn-success"><i className="fa-solid fa-magnifying-glass"></i></button></Link></div>,
            width: '90px'
        }
    ]

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-12">
                        <div className="card card-primary">
                            <div className="card-header">
                                <h3 className="card-title">Order</h3>
                            </div>
                            <div className="card-body">
                                <DataTable
                                    columns={columnOrder}
                                    data={order}
                                    pagination
                                    customStyles={customStyle}
                                    progressPending={loadingOrder}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
