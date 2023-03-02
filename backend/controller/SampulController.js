import Sampul from "../model/SampulModel.js"

export const getSampul = async(req, res) => {
    try {
        const sampul = await Sampul.findAll({
            where: {
                BukuID: req.params.id
            }
        })
        res.json({
            status: 200,
            data: sampul,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteSampul = async(req, res) => {
    try {
        await Sampul.destroy({
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