import Customer from "../model/CustomerModel.js"
import md5 from 'md5'
import AksesToken from "../model/AksesTokenModel.js"
import Cart from "../model/CartModel.js"
import fs from "fs"
import client from "../client/client.js"
import Verification from "../model/VerificationModel.js"

export const register = async(req, res) => {
    try {
        const check = await Customer.findAll({
            where: {
                Email: req.body.Email
            }
        })

        const checktelp = await Customer.findAll({
            where: {
                NoTelp: req.body.NoTelp
            }
        })

        if(check.length > 0) {
            res.json({
                status: 400,
                message: 'Email ini sudah digunakan'
            })
        } else if(checktelp.length > 0) {
            res.json({
                status: 400,
                message: 'Nomor Telephone ini sudah digunakan'
            })
        } else {
            const object =  {
                NamaPanggilan: req.body.NamaPanggilan,
                NamaLengkap: req.body.NamaLengkap,
                Email: req.body.Email,
                NoTelp: req.body.NoTelp,
                Alamat: req.body.Alamat,
                Password: md5(req.body.Password)
            }
            await Customer.create(object)
            res.json({
                status: 200,
                message: 'Akun berhasil dibuat'
            })
        }

    } catch (error) {
        console.log(error)
    }
}

export const getOTP = async(req, res) => {
    try {
        const check = await Customer.findAll({
            where: {
                NoTelp: req.body.NoTelp
            }
        })

        if(check.length > 0) {
            res.json({
                status: 400,
                message: 'Nomor ini sudah digunakan'
            })
        } else {
            const code = Math.floor(1000 + (9999 - 1000)*Math.random())
            var object = {
                Code: code,
                NoTelp: req.body.NoTelp,
                Kadaluars: Date.now()+1000*60*10
            }

            await Verification.create(object)
            const message = `Gunakan kode OTP *${code}* untuk verifikasi nomor anda pada website bukubook\n\n**Perhatian!* jika anda merasa tidak pernah memasukkan nomor anda ke dalam website bukubook tolong abaikan pesan ini`
            client.sendMessage(`62${req.body.NoTelp}@c.us`, message)
            res.json({
                status: 200,
                message: 'Terkirim'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const verifikasiOTP = async(req, res) => {
    try {
        const otp = await Verification.findOne({
            where: {
                NoTelp: req.body.NoTelp,
                Code: req.body.OTP
            },
            order: [
                ['id', 'DESC']
            ]
        })
        if(!otp) {
            res.json({
                status: 404,
                message: 'Kode OTP yang dimasukkan salah!'
            })
        } else {
            if(otp.Kadaluarsa > Date.now()) {
                res.json({
                    status: 403,
                    message: 'Kode otp telah kadaluarsa'
                })
            } else {
                res.json({
                    status: 200,
                    message: 'Berhasil verifikasi'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const login = async(req, res) => {
    try {
        const customer = await Customer.findOne({
            where: {
                NoTelp: req.body.NoTelp
            }
        })
        if(customer) {
            if(customer.Password === md5(req.body.Password)) {
                const token = md5(`${customer.id}${Date.now()}`)
                const object = {
                    AksesToken: token,
                    CustomerID: customer.id,
                    Kadaluarsaa: Date.now()+24*60*60*1000
                }
                await AksesToken.create(object)
                res.json({
                    status: 200,
                    accesstoken: token,
                    message: 'Selamat datang kembali'
                })
            } else {
                res.json({
                    status: 401
                })
            }
        } else {
            res.json({
                status: 404,
                message: 'Akun tidak ditemukan'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getCustomer = async(req, res) => {
    try {
        const data = await Customer.findOne({
            include: [
                {
                    model: AksesToken,
                    as: 'Token',
                    where: {
                        AksesToken: req.body.AksesToken
                    },
                    attributes: ['AksesToken', 'Kadaluarsaa']
                }
            ]
        })
        if(!data) {
            res.json({
                status: 404,
            })
        } else {
            if(data.Token[0].Kadaluarsaa < Date.now()) {
                res.json({
                    status: 403
                })
            } else {
                res.json({
                    status: 200,
                    data: data,
                    message: 'Ok'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const getCustomerNotif = async(req, res) => {
    try {
        const data = await Customer.findOne({
            include: [
                {
                    model: AksesToken,
                    as: 'Token',
                    where: {
                        AksesToken: req.body.AksesToken
                    },
                    attributes: ['AksesToken', 'Kadaluarsaa']
                },
                {
                    model: Cart,
                    as: 'Cart'
                }
            ]
        })
        if(!data) {
            res.json({
                status: 404,
            })
        } else {
            if(data.Token[0].Kadaluarsaa < Date.now()) {
                res.json({
                    status: 403
                })
            } else {
                var val = {
                    NamaPanggilan: data.NamaPanggilan,
                    jumlah: data.Cart.length
                }
                res.json({
                    status: 200,
                    data: val,
                    message: 'Ok'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateCustomer = async(req, res) => {
    try {
        if(!req.file) {
            const id = await Customer.findOne({
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
            await Customer.update(req.body, {
                where: {
                    ID: id.id
                }
            })
            res.json({
                status: 200,
                message: 'Berhasil memasukkan data'
            })
        } else {
            const id = await Customer.findOne({
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

            fs.unlink(id.Profil.replace('http://127.0.0.1:5000', '.'), (err => {
                if(err) console.log(err)
            }))

            const object = {
                NamaLengkap: req.body.NamaLengkap,
                NamaPanggilan: req.body.NamaPanggilan,
                NoTelp: req.body.NoTelp,
                Alamat: req.body.Alamat,
                Profil: 'http://127.0.0.1:5000/foto/customer/' + req.file.filename
            }
            await Customer.update(object, {
                where: {
                    ID: id.id
                }
            })
            res.json({
                status: 200,
                message: 'Berhasil memasukkan data'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            status: 503,
            message: 'Server mengalami masalah'
        })
    }
}