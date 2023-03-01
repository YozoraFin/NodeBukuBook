import { Op, Sequelize } from 'sequelize'
import Buku from '../model/BukuModel.js'
import Genre from '../model/GenreModel.js'

export const getBuku = async(req, res) => {
    try {
        var filterBuku = {}
        if(req.query.min) {
            filterBuku.where = {
                Harga: {
                    [Op.gte]: req.query.min
                }
            }
        }
        console.log(filterBuku)
        const buku = await Buku.findAll({
            attributes: ['ID', 'Judul', 'Sinopsis', 'Penulis', 'Harga', 'Stok', 'Genreid'],
            include: [{
                model: Genre,
                as: 'Genre',
                where: {
                }
            }],
            filterBuku
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
        if(req.files.length > 0) {

        } else {
            await Buku.create(req.body)
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