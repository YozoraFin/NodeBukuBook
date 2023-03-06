import { Sequelize } from "sequelize"
import Buku from "../model/BukuModel.js"
import Genre from "../model/GenreModel.js"

export const getGenre = async(req, res) => {
    try {
        const genrelist = await Genre.findAll({
            attributes: ['ID', 'Genre'],
            order: [
                ['Genre', 'ASC']
            ],
            include: [{
                model: Buku,
                as: 'Buku',
                attributes: ['ID']
            }]
        })

        var genre = []

        for (let index = 0; index < genrelist.length; index++) {
            const element = genrelist[index];
            genre.push({
                ID: element.dataValues.ID,
                Genre: element.Genre,
                Total: element.Buku.length
            })
        }

        res.json({
            status: 200,
            data: genre,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const getDetailGenre = async(req, res) => {
    try {
        const genre = await Genre.findOne({
            where: {
                ID: req.params.id
            },
            attributes: ['ID', 'Genre']
        })
        res.json({
            status: 200,
            data: genre,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const createGenre = async(req, res) => {
    try {
        await Genre.create(req.body)
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateGenre = async(req, res) => {
    try {
        await Genre.update(req.body, {
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

export const deleteGenre = async(req, res) => {
    try {
        await Genre.destroy({
            where: {
                ID: req.params.id
            }
        })
        const newVal = {
            Genrehid: 0,
            Genreid: 0
        }
        await Buku.update(newVal, {
            where: {
                Genrehid: req.params.id
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