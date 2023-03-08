import AksesToken from "../model/AksesTokenModel.js"
import Buku from "../model/BukuModel.js"
import Customer from "../model/CustomerModel.js"
import OrderDetail from "../model/OrderDetailModel.js"
import Order from "../model/OrderModel.js"
import dotenv from 'dotenv'
dotenv.config()
const adminpass = process.env.ADMIN_KEY

export const getOrder = async(req, res) => {
    try {
        const customer = await Customer.findOne({
            include: [
                {
                    model: AksesToken,
                    as: 'Token',
                    where: {
                        AksesToken: req.body.AksesToken
                    }
                }
            ]
        })

        if(!customer) {
            res.json({
                status: 404,
                message: 'User tidak ditemukan'
            })
        } else {
            if(customer.Token[0].Kadaluarsaa < Date.now()) {
                res.json({
                    status: 403,
                    message: 'Mohon untuk login ulang'
                })
            } else {
                const order = await Order.findAll({
                    where: {
                        CustomerID: customer.id
                    },
                    attributes: ['Total', 'Tanggal', ['InvoiceNumber', 'Invoice'], ['id', 'ID']],
                    order: [
                        ['ID', 'Desc']
                    ]
                })
                res.json({
                    status: 200,
                    data: order,
                    message: 'Ok'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const getOrderDetail = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            include: [
                {
                    model: AksesToken,
                    as: 'Token',
                    where: {
                        AksesToken: req.body.AksesToken
                    }
                }
            ]
        })
        if(!customer) {
            res.json({
                status: 404,
                message: 'User tidak ditemukan'
            })
        } else {
            if(customer.Token[0].Kadaluarsaa < Date.now()) {
                res.json({
                    status: 403,
                    message: 'Mohon login ulang'
                })
            } else {
                const order = await Order.findOne({
                    where: {
                        ID: req.params.id,
                        CustomerID: customer.id
                    },
                    include: [
                        {
                            model: OrderDetail,
                            as: 'Detail',
                            include: [
                                {
                                    model: Buku,
                                    as: 'Buku',
                                    attributes: [['Harga', 'HargaSatuan'], 'Judul']
                                }
                            ],
                            attributes: [['Quantity', 'Jumlah'], 'Subtotal']
                        }
                    ],
                    attributes: ['Alamat', 'Email', ['InvoiceNumber', 'Invoice'], 'Kodepos', 'Kota', 'Nama', 'NoTelp', 'Ongkir', 'Provinsi', 'Tanggal', 'Total', 'Subtotal']
                })

                if(!order) {
                    res.json({
                        status: 403,
                        message: 'Pesanan tidak ditemukan'
                    })
                } else {
                    res.json({
                        status: 200,
                        data: order,
                        message: 'Ok'
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAdminOrder = async(req, res) => {
    try {
        if(req.body.Pass !== adminpass) {
            res.json({
                status: 403,
                message: 'Akses ditolak'
            })
        } else {
            const order = await Order.findAll({
                attributes: ['Total', 'ID', ['InvoiceNumber', 'Invoice'], 'Tanggal', 'Nama']
            })

            res.json({
                status: 200,
                data: order,
                message: 'Ok'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAdminOrderDetail = async(req, res) => {
    try {
        if(req.body.Pass !== process.env.ADMIN_KEY) {
            res.json({
                status: 403,
                message: 'Akses Ditolak'
            })
        } else {
            const order = await Order.findOne({
                where: {
                    ID: req.params.id
                },
                include: [
                    {
                        model: OrderDetail,
                        as: 'Detail',
                        include: [
                            {
                                model: Buku,
                                as: 'Buku',
                                attributes: [['Harga', 'HargaSatuan'], 'Judul']
                            }
                        ],
                        attributes: [['Quantity', 'Jumlah'], 'Subtotal']
                    }
                ],
                attributes: ['Alamat', 'Email', ['InvoiceNumber', 'Invoice'], 'Kodepos', 'Kota', 'Nama', 'NoTelp', 'Ongkir', 'Provinsi', 'Tanggal', 'Total', 'Subtotal']
            })
            res.json({
                status: 200,
                data: order,
                message: 'Ok'
            })
        }
    } catch (error) {
        console.log(error)
    }
}