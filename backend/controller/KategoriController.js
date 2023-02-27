import Kategori from "../model/KategoriModel.js"

export const getKategori = async(req, res) => {
    try {
        const kategori = await Kategori.findAll({
            attributes: ['id', 'Kategori']
        })
        res.json({
            status: 200,
            data: kategori,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const getDetailKategori = async(req, res) => {
    try {
        const kategori = await Kategori.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'Kategori']
        })
        res.json({
            status: 200,
            data: kategori,
            message: 'Ok'
        })
    } catch(error) {
        console.log(error)
    }
}

export const createKategori = async(req, res) => {
    try {
        await Kategori.create(req.body)
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateKategori = async(req, res) => {
    try {
        await Kategori.update(req.body, {
            where: {
                id: req.params.id
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

export const deleteKategori = async(req, res) => {
    try {
        await Kategori.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json({
            status: 200,
            message: 'OK'
        })
    } catch (error) {
        console.log(error)
    }
}