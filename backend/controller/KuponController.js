import { Op } from "sequelize";
import AksesToken from "../model/AksesTokenModel.js";
import Customer from "../model/CustomerModel.js";
import Kupon from "../model/KuponModel.js"
import KuponPribadi from "../model/KuponPribadiModel.js";
import dotenv from 'dotenv'
dotenv.config()
const adminpass = process.env.ADMIN_KEY

export const getKupon = async(req, res) => {
    try {
        const kupon = await Kupon.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [
                {
                    model: Customer,
                    as: 'Customer',
                    through: {attributes: []},
                    include: [
                        {
                            model: AksesToken,
                            as: 'Token',
                        }
                    ]
                }
            ],
            where: {
                [Op.or]: [
                    {'$Customer.Token.AksesToken$': req.body.AksesToken},
                    {'Akses': 0}
                ]
            }
        })
        
        let dKupon = []
        for (let index = 0; index < kupon.length; index++) {
            const element = kupon[index];
            dKupon.push({
                id: element.id,
                Judul: element.Judul,
                Deskripsi: element.Deskripsi,
                Kode: element.Kode,
                Tipe: element.Tipe,
                Potongan: element.Potongan,
                Teaser: element.Teaser,
                SrcGambar: element.SrcGambar,
                NamaGambar: element.NamaGambar,
                HighLight: element.HighLight,
                Minimal: element.Minimal,
                Mulai: element.Mulai,
                Selesai: element.Selesai
            })
        }

        let hKupon = await Kupon.findOne({
            where: {
                HighLight: 1
            }
        })
        if(!hKupon) {
            hKupon = await Kupon.findOne({
                order: [
                    ['id', 'DESC']
                ]
            })
        }

        res.json({
            status: 200,
            data: dKupon,
            hData: hKupon,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const getKuponAdmin = async(req, res) => {
    try {
        if(adminpass === req.body.Pass) {
            const kupon = await Kupon.findAll({
                order: [
                    ['id', 'DESC']
                ]
            })
            
            let dKupon = []
            for (let index = 0; index < kupon.length; index++) {
                const element = kupon[index];
                dKupon.push({
                    id: element.id,
                    Judul: element.Judul,
                    Deskripsi: element.Deskripsi,
                    Kode: element.Kode,
                    Tipe: element.Tipe,
                    Potongan: element.Potongan,
                    Teaser: element.Teaser,
                    SrcGambar: element.SrcGambar,
                    NamaGambar: element.NamaGambar,
                    HighLight: element.HighLight,
                    Akses: element.Akses,
                    Minimal: element.Minimal,
                    Mulai: element.Mulai,
                    Selesai: element.Selesai
                })
            }
    
            res.json({
                status: 200,
                data: dKupon,
                message: 'Ok'
            })
        } else {
            res.json({
                statu: 403,
                message: 'Tidak memiliki akses'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const checkKupon = async(req, res) => {
    try {
        const kupon = await Kupon.findOne({
            where: {
                Kode: req.body.Kode,
            }
        })
        if(kupon) {
            if(kupon.Akses) {
                const customer = await Customer.findOne({
                    include: {
                        model: AksesToken,
                        as: 'Token',
                        where: {
                            AksesToken: req.body.AksesToken
                        }
                    }
                })
                const check = await KuponPribadi.findOne({
                    where: {
                        CustomerID: customer.id,
                        KuponID: kupon.id
                    }
                })
                if(!check) {
                    res.json({
                        status: 404,
                        message: 'Kode tidak ditemukan'
                    })
                }
            }
            if(kupon.Minimal > req.body.Subtotal) {
                res.json({
                    status: 403,
                    message: 'Subtotal pesanan belum memenuhi persyaratan minimal'
                })
            }
            if(kupon.Mulai > new Date().getTime() || kupon.Selesai < new Date().getTime()) {
                res.json({
                    status: 403,
                    message: 'Kupon saat ini belum bisa digunakan'
                })
            }
            const data = {
                Potongan: kupon.Potongan,
                Tipe: kupon.Tipe,
                id: kupon.id
            }
            res.json({
                status: 200,
                data: data,
                message: 'Berhasil menambahkan potongan'
            })
        } else {
            res.json({
                status: 404,
                message: 'Kupon tidak ditemukan'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getDetailKupon = async(req, res) => {
    try {
        const kupon = await Kupon.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'Judul', 'Deskripsi', 'Kode', 'Tipe', 'Potongan', 'NamaGambar', 'SrcGambar', 'Minimal', 'Mulai', 'Selesai']
        })
        res.json({
            status: 200,
            data: kupon,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const getDetailKuponAdmin = async(req, res) => {
    try {
        if(adminpass === req.body.Pass) {
            const kupon = await Kupon.findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    {
                        model: Customer,
                        as: 'Customer',
                        attributes: ['id', 'NamaLengkap', 'Email'],
                        through: {attributes: []}
                    }
                ]
            })
            res.json({
                status: 200,
                data: kupon,
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

export const createKupon = async(req, res) => {
    try {
        console.log(req.body)
        const check = await Kupon.findOne({
            where: {
                Kode: req.body.Kode
            }
        })
        if(!check) {
            if(req.body.HighLight) {
                const cHL = await Kupon.findOne({
                    where: {
                        HighLight: 1
                    }
                })
                if(cHL) {
                    const tObject = {
                        HighLight: 0
                    }
                    await Kupon.update(tObject, {
                        where: {
                            id: cHL.id
                        }
                    })
                }
            }

            let object = {
                Judul: req.body.Judul,
                Deskripsi: req.body.Deskripsi,
                Kode: req.body.Kode,
                Tipe: req.body.Tipe,
                Potongan: req.body.Potongan,
                Teaser: req.body.Teaser,
                HighLight: req.body.HighLight === 'on' ? 1 : 0,
                Mulai: req.body.Mulai,
                Selesai: req.body.Selesai,
                Minimal: req.body.Minimal && req.body.Minimal !== '' ? req.body.Minimal : 0,
                Akses: req.body.Akses
            }

            if(req.file) {
                object = {
                    ...object,
                    SrcGambar: 'http://127.0.0.1:5000/foto/kupon/'+req.file.filename,
                    NamaGambar: req.body.NamaGambar,
                }
            }
            const kupon = await Kupon.create(object)
            if(req.body.Akses) {
                let customer = req.body.Customer.split(',').map(id => parseInt(id))
                console.log(customer)
                for(var i = 0; i < customer.length; i++) {
                    console.log(customer[i])
                    await KuponPribadi.create({
                        CustomerID: customer[i],
                        KuponID: kupon.id
                    })
                }
            }
            res.json({
                status: 200,
                message: 'Berhasil dibuat'
            })
        } else {
            res.json({
                status: 400,
                message: 'Kode ini sudah digunakan'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateKupon = async(req, res) => {
    try {
        const check = await Kupon.findOne({
            where: {
                Kode: req.body.Kode
            }
        })
        let next = true
        if(check && check.id !== Number(req.params.id)) {
            next = false
        }
        if(next) {
            if(req.body.HighLight) {
                const cHL = await Kupon.findOne({
                    where: {
                        HighLight: 1
                    }
                })
                if(cHL) {
                    const tObject = {
                        HighLight: 0
                    }
                    await Kupon.update(tObject, {
                        where: {
                            id: cHL.id
                        }
                    })
                }
            }
            let object = {
                Judul: req.body.Judul,
                Deskripsi: req.body.Deskripsi,
                Kode: req.body.Kode,
                Tipe: req.body.Tipe,
                Potongan: req.body.Potongan,
                Teaser: req.body.Teaser,
                HighLight: req.body.HighLight === 'on' ? 1 : 0,
                Mulai: req.body.Mulai,
                Selesai: req.body.Selesai,
                Akses: req.body.Akses,
                Minimal: req.body.Minimal && req.body.Minimal !== '' ? req.body.Minimal : 0,
                BatasPakai: req.body.BatasPakai && req.body.BatasPakai !== '' ? req.body.BatasPakai : 0
            }

            if(req.file) {
                object = {
                    ...object,
                    SrcGambar: 'http://127.0.0.1:5000/foto/kupon/'+req.file.filename,
                    NamaGambar: req.body.NamaGambar,    
                }
            }
            
            await KuponPribadi.destroy({
                where: {
                    KuponID: req.params.id
                }
            })
            await Kupon.update(object, {
                where: {
                    id: req.params.id
                }
            })
            if(req.body.Akses) {
                let customer = req.body.Customer.split(',').map(id => parseInt(id))
                for(var i = 0; i < customer.length; i++) {
                    console.log(customer[i])
                    await KuponPribadi.create({
                        CustomerID: customer[i],
                        KuponID: req.params.id
                    })
                }
            }
            res.json({
                status: 200,
                message: 'Berhasil diperbarui'
            })
        } else {
            res.json({
                status: 400,
                message: 'Kode ini sudah digunakan'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteKupon = async(req, res) => {
    try {
        await Kupon.destroy({
            where: {
                id: req.params.id
            }
        })
        await KuponPribadi.destroy({
            where: {
                KuponID: req.params.id
            }
        })
        res.json({
            status: 200,
            message: 'Berhasil dihapus'
        })
    } catch (error) {
        console.log(error)
    }
}