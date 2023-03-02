import Genre from "../model/GenreModel.js"

export const getGenre = async(req, res) => {
    try {
        const genre = await Genre.findAll({
            attributes: ['ID', 'Genre'],
            order: [
                ['Genre', 'ASC']
            ]
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

export const getDetailGenre = async(req, res) => {
    try {
        const genre = await Genre.findOne({
            where: {
                ID: req.params.id
            },
            attributes: ['ID', 'Genre']
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
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}