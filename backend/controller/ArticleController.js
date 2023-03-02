import Article from "../model/ArticleModel.js"
import Kategori from "../model/KategoriModel.js"

export const getArticle = async(req, res) => {
    try {
        let articledata
        if(!req.query.kategori && req.query.penulis) {
            articledata = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar'],
                where: {
                    Penulis: req.query.penulis
                },
                include: [{
                    model: Kategori,
                }]
            })
        } else if(!req.query.penulis && req.query.kategori) {
            articledata = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar'],
                include: [{
                    model: Kategori,
                    where: {
                        Kategori: req.query.kategori
                    }
                }]
            })
        } else {
            articledata = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar'],
                include: [{
                    model: Kategori
                }]
            })
        }
        res.status(200).json({
            status: 200,
            data: articledata,
            message: 'Ok'
        })
    } catch(error) {
        console.log(error)
    }
}

export const getDetailArticle = async(req, res) => {
    try {
        const article = await Article.findOne({
            attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar'],
            where: {
                id: req.params.id
            }
        })
        let kategori
        if(article.KategoriID === 0) {
            kategori = 'Kategori'
        } else {
            let kat = await Kategori.findOne({
                attributes: ['Kategori'],
                where: {
                    id: article.KategoriID
                }
            })
            kategori = kat.Kategori
        }
        const data = {
            id: article.id,
            Judul: article.Judul,
            Isi: article.Isi,
            Penulis: article.Penulis,
            Teaser: article.Teaser,
            KategoriID: article.KategoriID,
            SrcGambar: article.SrcGambar,
            Kategori: kategori,
            NamaGambar: article.NamaGambar
        }
        res.json({
            status: 200,
            data: data,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const createArticle = async(req, res) => {
    try {
        if(!req.file) {
            await Article.create(req.body)
            res.json({
                status: 200,
                message: 'Ok'
            })
        } else {
            var newVal = {
                Judul: req.body.Judul,
                Isi: req.body.Isi,
                Penulis: req.body.Penulis,
                Teaser: req.body.Teaser,
                KategoriID: req.body.KategoriID,
                SrcGambar: 'http://127.0.0.1:5000/foto/artikel/'+req.file.filename,
                NamaGambar: req.body.NamaGambar
            }
            await Article.create(newVal)
            res.json({
                status: 200,
                message: 'Ok'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateArticle = async(req, res) => {
    try {
        if(!req.file) {
            await Article.update(req.body, {
                where: {
                    id: req.params.id
                }
            })
            res.json({
                status: 200,
                message: 'Ok'
            })
        } else {
            var newVal = {
                Judul: req.body.Judul,
                Isi: req.body.Isi,
                Penulis: req.body.Penulis,
                Teaser: req.body.Teaser,
                KategoriID: req.body.KategoriID,
                SrcGambar: 'http://127.0.0.1:5000/foto/artikel/'+req.file.filename,
                NamaGambar: req.body.NamaGambar
            }
            await Article.update(newVal, {
                where: {
                    id: req.params.id
                }
            })
            res.json({
                status: 200,
                message: 'Ok'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteArticle = async(req, res) => {
    try {
        await Article.destroy({
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