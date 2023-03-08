import { Sequelize } from "sequelize"
import AksesToken from "../model/AksesTokenModel.js"
import Buku from "../model/BukuModel.js"
import Cart from "../model/CartModel.js"
import Customer from "../model/CustomerModel.js"
import Sampul from "../model/SampulModel.js"

export const getCart = async(req, res) => {
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
                const cart = await Cart.findAll({
                    where: {
                        CustomerID: customer.id
                    },
                    include: [
                        {
                            model: Buku,
                            as: 'Buku',
                            include: [
                                {
                                    model: Sampul,
                                    as: 'Sampul',
                                    attributes: ['SrcGambar']
                                }
                            ],
                            attributes: ['id', 'Judul', 'Harga', 'Stok']
                        }
                    ],
                    attributes: [['qty', 'Jumlah']]
                })
                const jumlah = await Cart.sum('qty', {
                    where: {
                        CustomerID: customer.id
                    }
                })

                var subharga = 0
                var perBuku = []

                cart.forEach(element => {
                    subharga += element.dataValues.Jumlah*element.dataValues.Buku.dataValues.Harga
                    perBuku.push(element.dataValues.Jumlah*element.dataValues.Buku.dataValues.Harga)
                });

                res.json({
                    status: 200,
                    data: cart,
                    jumlah: jumlah,
                    subtotal: subharga,
                    subbuku: perBuku,
                    message: 'OK'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const addCart = async(req, res) => {
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
                const buku = await Buku.findOne({
                    where: {
                        ID: req.body.BukuID
                    }
                })
                const cart = await Cart.findOne({
                    where: {
                        CustomerID: customer.id,
                        BukuID: req.body.BukuID
                    }
                })
                if(!cart) {
                    if(req.body.qty > buku.Stok) {
                        res.json({
                            status: 400,
                            message: 'Jumlah barang yang dipesan melebihi stok'
                        })
                    } else {
                        const object = {
                            CustomerID: customer.id,
                            BukuID: req.body.BukuID,
                            qty: req.body.qty
                        }
                        await Cart.create(object)
                        res.json({
                            status: 200,
                            message: 'Berhasil menambahkan'
                        })
                    }
                } else {
                    if(req.body.qty + cart.qty > buku.Stok) {
                        res.json({
                            status: 400,
                            message: 'Total barang yang sedang anda pesan melebihi stok'
                        })
                    } else {
                        const object = {
                            qty: req.body.qty + cart.qty
                        }
                        await Cart.update(object, {
                            where: {
                                BukuID: req.body.BukuID,
                                CustomerID: customer.id
                            }
                        })
                        res.json({
                            status: 200,
                            message: 'Berhasil menambahkan barang'
                        })
                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateCart = async(req, res) => {
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
                const buku = await Buku.findOne({
                    where: {
                        ID: req.body.BukuID
                    }
                })

                if(req.body.qty > buku.Stok) {
                    res.json({
                        status: 400,
                        message: 'Buku yang coba ditambahkan melebihi stok'
                    })
                } else {
                    var object = {
                        CustomerID: customer.id,
                        BukuID: req.body.BukuID,
                        qty: req.body.qty
                    }
                    await Cart.update(object, {
                        where: {
                            BukuID: req.body.BukuID,
                            CustomerID: customer.id
                        }
                    })
                    res.json({
                        status: 200,
                        message: 'Berhasil memperbarui'
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const removeCart = async(req, res) => {
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
                await Cart.destroy({
                    where: {
                        CustomerID: customer.id,
                        BukuID: req.body.BukuID
                    }
                })
                res.json({
                    status: 200,
                    message: 'Berhasil menghapus buku'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const removeAllCart = async(req, res) => {
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
                await Cart.destroy({
                    where: {
                        CustomerID: customer.id
                    }
                })
                res.json({
                    status: 200,
                    message: 'Berhasil menghapus dari keranjang'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}