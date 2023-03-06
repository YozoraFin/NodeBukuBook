import AksesToken from "../model/AksesTokenModel.js"
import Customer from "../model/CustomerModel.js"
import Komentar from "../model/KomentarModel.js"

export const sendKomentar = async(req, res) => {
    try {
        const check = await Customer.findOne({
            include: [
                {
                    model: AksesToken,
                    as: 'Token',
                    where: {
                        AksesToken: req.body.AksesToken
                    },
                    attributes: ['AksesToken', 'Kadaluarsaa']
                }
            ]
        })
        if(!check) {
            res.json({
                status: 404
            })
        } else {
            if(check.Token[0].Kadaluarsa < Date.now()) {
                res.json({
                    status: 403
                })
            } else {
                const month = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
                const date = new Date()
                const object = {
                    CustomerID: check.id,
                    ArticleID: req.body.ArticleID,
                    Komentar: req.body.Komentar,
                    Tanggal: `${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}` 
                }
                console.log(`${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}`)
                await Komentar.create(object)
                res.json({
                    status: 200,
                    message: 'Berhasil menambahkan komentar'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}