import Customer from "../model/CustomerModel.js"
import md5 from 'md5'
import AksesToken from "../model/AksesTokenModel.js"
import Cart from "../model/CartModel.js"
import fs from "fs"
import client from "../client/client.js"
import Verification from "../model/VerificationModel.js"
import dotenv from 'dotenv'
dotenv.config()
const adminpass = process.env.ADMIN_KEY

export const register = async(req, res) => {
    try {
        let noTelp = req.body.NoTelp
        noTelp = noTelp.replace(/\s/g, '')
        noTelp = noTelp.replace(/-/g, '')
        if(noTelp.startsWith('0')) {
            noTelp = noTelp.substring(1)
        } else if(noTelp.startsWith('+62')) {
            noTelp = noTelp.substring(3)
        } else if(noTelp.startsWith('62')) {
            noTelp = noTelp.substring(2)
        }
        const check = await Customer.findAll({
            where: {
                Email: req.body.Email
            }
        })

        const checktelp = await Customer.findAll({
            where: {
                NoTelp: noTelp
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
                NoTelp: noTelp,
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
        let noTelp = req.body.NoTelp
        noTelp = noTelp.replace(/\s/g, '')
        noTelp = noTelp.replace(/-/g, '')
        if(noTelp.startsWith('0')) {
            noTelp = noTelp.substring(1)
        } else if(noTelp.startsWith('+62')) {
            noTelp = noTelp.substring(3)
        } else if(noTelp.startsWith('62')) {
            noTelp = noTelp.substring(2)
        }
        
        const check = await Customer.findAll({
            where: {
                NoTelp: noTelp
            }
        }) 

        if(check.length > 0) {
            res.json({
                status: 400,
                message: 'Nomor ini sudah digunakan'
            })
        } else {
            await Verification.destroy({
                where: {
                    NoTelp: noTelp
                }
            })
            const code = Math.floor(1000 + (9999 - 1000)*Math.random())
            var object = {
                Code: code,
                NoTelp: noTelp,
                Kadaluars: Date.now()+1000*60*10
            }

            await Verification.create(object)
            const message = `Gunakan kode OTP *${code}* untuk verifikasi nomor anda pada website bukubook\n\n**Perhatian!* jika anda merasa tidak pernah memasukkan nomor anda ke dalam website bukubook tolong abaikan pesan ini`
            client.sendMessage(`62${noTelp}@c.us`, message)
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
        let noTelp = req.body.NoTelp
        noTelp = noTelp.replace(/\s/g, '')
        noTelp = noTelp.replace(/-/g, '')
        if(noTelp.startsWith('0')) {
            noTelp = noTelp.substring(1)
        } else if(noTelp.startsWith('+62')) {
            noTelp = noTelp.substring(3)
        } else if(noTelp.startsWith('62')) {
            noTelp = noTelp.substring(2)
        }

        const otp = await Verification.findOne({
            where: {
                NoTelp: noTelp,
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
                const customer = await Customer.findOne({
                    where: {
                        NoTelp: noTelp
                    }
                })
                if(customer) {
                    let token = ''
                    let completed = true
                    if(customer.NamaLengkap !== '') {
                        await AksesToken.destroy({
                            where: {
                                CustomerID: customer.id
                            }
                        })
                        token = md5(`${customer.id}${Date.now()}`)
                        const object = {
                            AksesToken: token,
                            CustomerID: customer.id,
                            Kadaluarsaa: Date.now()+24*60*60*1000*7
                        }
                        await AksesToken.create(object)
                    } else {
                        completed = false
                    }
                    console.log(completed)
                    res.json({
                        status: 200,
                        accesstoken: token,
                        data: completed,
                        message: 'Selamat datang kembali'
                    })
                }

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

export const loginOtp = async(req, res) => {
    try {
        let noTelp = req.body.NoTelp
        noTelp = noTelp.replace(/\s/g, '')
        noTelp = noTelp.replace(/-/g, '')
        if(noTelp.startsWith('0')) {
            noTelp = noTelp.substring(1)
        } else if(noTelp.startsWith('+62')) {
            noTelp = noTelp.substring(3)
        } else if(noTelp.startsWith('62')) {
            noTelp = noTelp.substring(2)
        }

        const customer = await Customer.findOne({
            where: {
                NoTelp: noTelp
            }
        })

        if(!customer) {
            return res.json({
                status: 404,
                message: 'Akun Tidak ditemukan'
            })
        }
        await Verification.destroy({
            where: {
                NoTelp: noTelp
            }
        })

        
        const code = Math.floor(1000 + (9999 - 1000)*Math.random())
        var object = {
            Code: code,
            NoTelp: noTelp,
            Kadaluars: Date.now()+1000*60*10
        }

        await Verification.create(object)
        const message = `Gunakan kode OTP *${code}* untuk verifikasi nomor anda pada website bukubook\n\n**Perhatian!* jika anda merasa tidak pernah memasukkan nomor anda ke dalam website bukubook tolong abaikan pesan ini`
        client.sendMessage(`62${noTelp}@c.us`, message)
        res.json({
            status: 200,
            message: 'Terkirim'
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = async(req, res) => {
    try {
        let noTelp = req.body.NoTelp
        noTelp = noTelp.replace(/\s/g, '')
        noTelp = noTelp.replace(/-/g, '')
        if(noTelp.startsWith('0')) {
            noTelp = noTelp.substring(1)
        } else if(noTelp.startsWith('+62')) {
            noTelp = noTelp.substring(3)
        } else if(noTelp.startsWith('62')) {
            noTelp = noTelp.substring(2)
        }

        const customer = await Customer.findOne({
            where: {
                NoTelp: noTelp
            }
        })
        if(customer) {
            if(customer.Password === md5(req.body.Password)) {
                let token = ''
                let completed = true
                if(customer.NamaLengkap !== '') {
                    await AksesToken.destroy({
                        where: {
                            CustomerID: customer.id
                        }
                    })
                    token = md5(`${customer.id}${Date.now()}`)
                    const object = {
                        AksesToken: token,
                        CustomerID: customer.id,
                        Kadaluarsaa: Date.now()+24*60*60*1000*7
                    }
                    await AksesToken.create(object)
                } else {
                    completed = false
                }
                console.log(completed)
                res.json({
                    status: 200,
                    accesstoken: token,
                    data: completed,
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
        let noTelp = req.body.NoTelp
        if(noTelp && noTelp != '') {
            noTelp = noTelp.replace(/\s/g, '')
            noTelp = noTelp.replace(/-/g, '')
            if(noTelp.startsWith('0')) {
                noTelp = noTelp.substring(1)
            } else if(noTelp.startsWith('+62')) {
                noTelp = noTelp.substring(3)
            } else if(noTelp.startsWith('62')) {
                noTelp = noTelp.substring(2)
            }
        }
        if(!req.file) {
            let object = {
                NamaLengkap: req.body.NamaLengkap,
                NamaPanggilan: req.body.NamaPanggilan,
                NoTelp: noTelp,
                Alamat: req.body.Alamat,
            }
            if(req.body.DeleteProfile === 'true') {
                object.Profil = ''
            }
            console.log(req.body)
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
            await Customer.update(object, {
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
                NoTelp: noTelp,
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

export const fillCustomer = async(req, res) => {
    try {
        const check = await Customer.findAll({
            where: {
                Email: req.body.Email
            }
        })
        if(check.length > 0) {
            res.json({
                status: 400,
                message: 'Email ini sudah digunakan'
            })
        } else {
            let noTelp = req.body.NoTelp
            noTelp = noTelp.replace(/\s/g, '')
            noTelp = noTelp.replace(/-/g, '')
            if(noTelp.startsWith('0')) {
                noTelp = noTelp.substring(1)
            } else if(noTelp.startsWith('+62')) {
                noTelp = noTelp.substring(3)
            } else if(noTelp.startsWith('62')) {
                noTelp = noTelp.substring(2)
            }
    
            const object = {
                NamaLengkap: req.body.NamaLengkap,
                NamaPanggilan: req.body.NamaPanggilan,
                Email: req.body.Email,
                Alamat: req.body.Alamat,
            }
    
            const id = await Customer.findOne({
                where: {
                    NoTelp: noTelp
                }
            })
            await Customer.update(object, {
                where: {
                    ID: id.id
                }
            })
    
            const token = md5(`${id.id}${Date.now()}`)
            const objectT = {
                AksesToken: token,
                CustomerID: id.id,
                Kadaluarsaa: Date.now()+24*60*60*1000*7
            }
            await AksesToken.create(objectT)
    
            res.json({
                status: 200,
                accesstoken: token,
                message: 'Berhasil memasukkan data'
            })
        }
        
    } catch (error) {
        console.log(error)
    }
}

export const tes = async(req, res) => {
    try {
        var offset = 20
        var chats = await client.getChats()
        var total = 0
        var total = Math.ceil(chats.length / 20)
        var slice = chats.slice(offset, offset + 20)
        var contact
        var message
        var body
        var profile
        var m = []

        for (let index = 0; index < 20; index++) {
            const element = slice[index];

            profile = await (await element?.getContact()).getProfilePicUrl()
            message = await element?.fetchMessages({limit: 1})
            body = {
                message: message[0].body,
                fromMe: message[0].fromMe,
                time: message[0].timestamp
            }
            m.push({
                nama: element.name,
                profile: profile,
                pesan: body,
                unread: element.unreadCount
            })
        }

        res.json({
            data: m
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAllCustomer = async(req, res) => {
    try {
        if(req.body.Pass === adminpass) {
            const customer = await Customer.findAll({
                attributes: ['id', 'NamaLengkap', 'Email'],
                order: [['Email', 'ASC']]
            })
            res.json({
                status: 200,
                data: customer,
                message: 'Ok'
            })
        } else {
            res.json({
                status: 403,
                message: 'Tidak memiliki akses'
            })
        }

    } catch (error) {
        console.log(error)
    }
}