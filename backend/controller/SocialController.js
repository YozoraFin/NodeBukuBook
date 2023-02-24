import Social from "../model/SocialModel.js"

export const getSocial = async (req, res) => {
    try {
        const social = await Social.findAll();
        res.status(200).json({
            status: 200,
            data: social,
            message: 'OK'
        })
    } catch(error) {
        console.log(error)
    }
}

export const getSocialDetail = async (req, res) => {
    try {
        const social = await Social.findByPk(req.params.id)
        res.status(200).json({
            status: 200,
            data: social,
            message: 'OK'
        })
    } catch(error) {
        console.log(error)
    }
}

export const createSocial = async (req, res) => {
    try {
        await Social.create(req.body)
        res.json({
            status: 200,
            message: 'OK'
        })
    } catch(error) {
        console.log(error)
    }
}

export const updateSocial = async (req, res) => {
    try {
        await Social.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.json({
            status: 200,
            message: 'Berhasil memperbarui data'
        })
    } catch(error) {
        console.log(error)
    }
}

export const deleteSocial = async (req, res) => {
    try {
        await Social.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json({
            status: 200,
            message: 'Berhasil menghapus data'
        })
    } catch (error) {
        console.log(error)
    }
}