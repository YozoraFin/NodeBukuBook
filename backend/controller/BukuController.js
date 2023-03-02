import { Op, Sequelize } from 'sequelize'
import Buku from '../model/BukuModel.js'
import Genre from '../model/GenreModel.js'
import Sampul from '../model/SampulModel.js'

export const getBuku = async(req, res) => {
    try {
        var filterGenre = {
            model: Genre,
            as: 'Genre',
            where: {
                
            }
        }

        if(req.query.genre) {
            filterGenre.where = {
                Genre: {
                    [Op.substring]: req.query.genre
                }
            }
        }

        var filterBuku = {
            attributes: ['ID', 'Judul', 'Sinopsis', 'Penulis', 'Harga', 'Stok', 'Genreid'],
            include: [filterGenre, {
                model: Sampul,
                attributes: ['id', 'SrcGambar', 'NamaGambar'],
                as: 'Sampul'
            }]
        }
        if(req.query.min || req.query.max) {
            filterBuku.where = {
                Harga: {
                    
                }
            }
        }
        if(req.query.min) {
            filterBuku.where.Harga = {
            ...filterBuku.where.Harga,
                [Op.gte]: req.query.min
            }
            
        }
        if(req.query.max) {
            filterBuku.where.Harga = {
                ...filterBuku.where.Harga,
                [Op.lte]: req.query.max
            }
        }
        if(req.query.keyword) {
            filterBuku.where = {
                ...filterBuku.where,
                [Op.or]: [
                    {
                        Judul: {
                            [Op.substring]: req.query.keyword
                        }
                    },
                    {
                        Penulis: {
                            [Op.substring]: req.query.keyword
                        }
                    }
                ]
            }
        }
        console.log(filterBuku)
        const buku = await Buku.findAll(filterBuku)
        res.json({
            status: 200,
            data: buku,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const getDetailBuku = async(req, res) => {
    try {
        const buku = await Buku.findOne({
            attributes: ['ID', 'Judul', 'Sinopsis', 'Penulis', 'Harga', 'Stok', 'Genreid'],
            where: {
                ID: req.params.id
            }
        })
        res.json({
            status: 200,
            data: buku,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const createBuku = async(req, res) => {
    try {
        if(req.files.length < 1) {
            await Buku.create(req.body)
        } else {
            // const buku = await Buku.create(req.body)
            for (let index = 0; index < req.files.length; index++) {
                const element = req.files[index];
                console.log(element.filename)
                // var newVal = {
                //     SrcGambar: 'http://127.0.0.1:5000/foto/buku/'+element.filename,
                //     NamaGambar: req.body.NamaGambar[index],
                //     BukuID: buku.id                   
                // }
                // await Sampul.create(newVal)
            }
        }
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateBuku = async(req, res) => {
    try {
        if(req.files.length > 0) {

        } else {
            await Buku.update(req.body, {
                where: {
                    ID: req.params.id
                }
            })
        }
        res.jsos({
            status: 200,
            message: 'OK'
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteBuku = async(req, res) => {
    try {  
        await Buku.destroy({
            where: {
                ID: req.params.id
            }
        })
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}