import { Op, Sequelize, QueryTypes } from 'sequelize'
import db from '../config/Database.js'
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
            attributes: ['ID', 'Judul', 'Sinopsis', 'Penulis', 'Harga', 'Stok', 'Genreid', 'genrehid'],
            include: [filterGenre, {
                model: Sampul,
                attributes: ['id', 'SrcGambar', 'NamaGambar'],
                as: 'Sampul'
            }],
            order: [
                ['ID', 'DESC']
            ]
        }

        if(req.query.sort) {
            if(req.query.sort === 'asc') {
                filterBuku.order = [
                    ['Judul', 'ASC']
                ]
            }
            if(req.query.sort === 'desc') {
                filterBuku.order = [
                    ['Judul', 'DESC']
                ]
            }
            if(req.query.sort === 'Termurah') {
                filterBuku.order = [
                    ['Harga', 'ASC']
                ]
            }
            if(req.query.sort === 'Termahal') {
                filterBuku.order = [
                    ['Harga', 'DESC']
                ]
            }
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
        let max = await Buku.findOne({
            order: [
                ['Harga', 'DESC']
            ]
        })
        console.log(filterBuku)
        const buku = await Buku.findAll(filterBuku)
        res.json({
            status: 200,
            data: buku,
            max: max.Harga,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const getRekomendedBuku = async(req, res) => {
    try {
        const buku = await Buku.findAll({
            where: {
                Rekomended: 1,
                Stok: {
                    [Op.gt]: 0
                }
            },
            order: [
                ['ID', 'DESC']
            ],
            include: [
                {
                    model: Sampul,
                    attributes: ['id', 'SrcGambar', 'NamaGambar'],
                    as: 'Sampul'
                },
                {
                    model: Genre,
                    as: 'Genre'
                }
            ]
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

export const getBestBuku = async(req, res) => {
    try {
        const id = await db.query('SELECT BukuID FROM `bukubook_content_orderdetail` GROUP BY BukuID ORDER BY SUM(Quantity) DESC', {type: QueryTypes.SELECT})
        let data = []
        for (let index = 0; index < id.length; index++) {
            const element = id[index];
            var buku = await Buku.findOne({
                where: {
                    id: element.BukuID
                },
                include: [
                    {
                        model: Sampul,
                        as: 'Sampul'
                    }
                ]
            })
            if(buku.Stok > 0) {
                data.push(buku)
            }
        }
        res.json({
            data: data
        })
    } catch (error) {
        console.log(error)
    }
}

export const getDetailBuku = async(req, res) => {
    try {
        const buku = await Buku.findOne({
            attributes: [['ID', 'IDbuku'], 'Judul', 'Sinopsis', 'Penulis', 'Harga', 'Stok', 'Genreid', 'genrehid', 'Rekomended'],
            where: {
                ID: req.params.id
            },
            include: [
                {
                    model: Sampul,
                    attributes: ['id', 'SrcGambar', 'NamaGambar'],
                    as: 'Sampul'
                },
                {
                    model: Genre,
                    as: 'Genre'
                }
            ]

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
            const buku = await Buku.create(req.body)
            for (let index = 0; index < req.files.length; index++) {
                const element = req.files[index];
                var newVal = {
                    SrcGambar: 'http://127.0.0.1:5000/foto/buku/'+element.filename,
                    NamaGambar: req.body.NamaGambar[index],
                    BukuID: buku.id                   
                }
                await Sampul.create(newVal)
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
            await Buku.update(req.body, {
                where: {
                    ID: req.params.id
                }
            })
            let NamaGambar
            if(req.files.length === 1) {
                NamaGambar = req.body.NamaGambar
            }
            for (let index = 0; index < req.files.length; index++) {
                const element = req.files[index];
                if(req.files.length > 1) {
                    NamaGambar = req.body.NamaGambar[index]
                }
                var newVal ={
                    SrcGambar: 'http://127.0.0.1:5000/foto/buku/'+element.filename,
                    NamaGambar: NamaGambar,
                    BukuID: req.params.id
                }
                await Sampul.create(newVal)
            }
            console.log('hai')
        } else {
            await Buku.update(req.body, {
                where: {
                    ID: req.params.id
                }
            })
        }
        res.json({
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
        await Sampul.destroy({
            where: {
                BukuID: req.params.id
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