import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router-dom'

export default function OrderDetail() {
    const [order, setOrderDetail] = useState({})
    const [loadingOrder, setLoadingOrder] = useState(true)
    const param = useParams()
    const separator = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    const getDatas = () => {
        const object = {
            Pass: process.env.REACT_APP_SECRET_ADMIN
        }
        axios.post('http://localhost:5000/order/admin/'+param.id, object).then((res) => {
            setOrderDetail(res.data.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoadingOrder(false)
        })
    }

    useEffect(() => {
        getDatas()
    }, [])

    const tabledetail = loadingOrder ?
                        (
                            <tr key={'tabledetailskeleton'}>
                                <td><Skeleton width={150} /></td>
                                <td><Skeleton width={40} /></td>
                                <td><Skeleton width={100} /></td>
                            </tr>
                        )
                        :
                        order?.Detail?.map((ord, index) => {
                            return(
                                <tr key={`tabledetail${index}`}>
                                    <td>{ord?.Buku.Judul}</td>
                                    <td>{ord?.Jumlah}</td>
                                    <td>Rp {loadingOrder ? separator(0) : separator(ord?.Subtotal)}</td>
                                </tr>
                            )
                        })

    return (
        <section className="content-wrapper">
            <div className="container-fluid">
                <div className="row pt-3 px-3">
                    <div className="col-12">
                        <div className="invoice p-3 mb-3">
                            <div className="row">
                                <div className="col-12">
                                    <h4>
                                        <i className="fas fa-book"></i> BukuBook
                                        <small className='float-right'>Tanggal: {order?.Tanggal}</small>
                                    </h4>
                                </div>
                            </div>
                            <div className="row invoice-info mt-3">
                                <div class="col-sm-4 invoice-col">
                                    <strong>Informasi Order</strong><br />
                                    <table>
                                        <tr>
                                            <td className='pr-3'>Invoice</td>
                                            <td>: {order?.Invoice}</td>
                                        </tr>
                                        <tr>
                                            <td className='pr-3'>Tanggal</td>
                                            <td>: {order?.Tanggal}</td>
                                        </tr>
                                        <tr>
                                            <td className='pr-3'>Total</td>
                                            <td>: Rp {loadingOrder ? separator(0) : separator(order?.Total)}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-sm-4 invoice-col">
                                    <strong>Informasi Pembeli</strong>
                                    <table>
                                        <tr>
                                            <td className="pr-3">Nama</td>
                                            <td>: {order?.Nama}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Telp</td>
                                            <td>: {order?.NoTelp}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Email</td>
                                            <td>: {order?.Email}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-sm-4 invoice-col">
                                    <strong>Alamat Tujuan</strong>
                                    <table>
                                        <tr>
                                            <td className="pr-right">Provinsi</td>
                                            <td>: {order?.Provinsi}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-right">Kota</td>
                                            <td>: {order?.Kota}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-right">Jalan</td>
                                            <td>: {order?.Alamat}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-right">Kodepos</td>
                                            <td>: {order?.Kodepos}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-12 table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Judul Buku</th>
                                                <th>Jumlah</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tabledetail}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td><b>Subtotal</b></td>
                                                <td></td>
                                                <td>Rp {loadingOrder ? separator(0) : separator(order?.Subtotal)}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Ongkir</b></td>
                                                <td></td>
                                                <td>Rp {loadingOrder ? separator(0) : separator(order?.Ongkir)}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Total</b></td>
                                                <td></td>
                                                <td>Rp {loadingOrder ? separator(0) : separator(order?.Total)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
