import Sampul from "../model/SampulModel.js"
import fs from "fs"

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
        const sampul = await Sampul.findOne({
            where: {
                ID: req.param.id
            }
        })

        fs.unlink(sampul.SrcGambar.replace('http://127.0.0.1:5000', '.'), (err => {
            if(err) console.log(err)
        }))

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