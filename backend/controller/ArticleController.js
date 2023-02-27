import Article from "../model/ArticleModel.js"
import Kategori from "../model/KategoriModel.js"

export const getArticle = async(req, res) => {
    try {
        let kategori
        let kategoridata = {}
        let articledata
        if(!req.query.kategori && req.query.penulis) {
            articledata = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar'],
                where: {
                    Penulis: req.query.penulis
                }
            })
            kategori = await Kategori.findAll({
                attributes: ['id', 'Kategori']
            })
            for (let index = 0; index < kategori.length; index++) {
                const element = kategori[index];
                kategoridata = {
                    ...kategoridata,
                    [element.id]: element.Kategori
                }
            }
        } else if(!req.query.penulis && req.query.kategori) {
            kategori = await Kategori.findOne({
                where: {
                    Kategori: req.query.kategori
                },
                attributes: ['Kategori', 'id']
            })
            kategoridata = {
                ...kategoridata,
                [kategori.id]: kategori.Kategori
            }
            articledata = await Article.findAll({
                where: {
                    KategoriID: kategori.id,
                },
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar']
            })
        } else {
            articledata = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar']
            })
            kategori = await Kategori.findAll({
                attributes: ['id', 'Kategori']
            })
            for (let index = 0; index < kategori.length; index++) {
                const element = kategori[index];
                kategoridata = {
                    ...kategoridata,
                    [element.id]: element.Kategori
                }
            }
        }
        res.status(200).json({
            status: 200,
            article: articledata,
            kategori: kategoridata,
            message: 'Ok'
        })
    } catch(error) {
        console.log(error)
    }
}

export const getDetailArticle = async(req, res) => {
    try {
        const article = await Article.findOne({
            attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar'],
            where: {
                id: req.params.id
            }
        })
        const kategori = await Kategori.findOne({
            attributes: ['Kategori'],
            where: {
                id: article.KategoriID
            }
        })
        const data = {
            id: article.id,
            Judul: article.Judul,
            Isi: article.Isi,
            Penulis: article.Penulis,
            Teaser: article.Teaser,
            KategoriID: article.KategoriID,
            SrcGambar: article.SrcGambar,
            Kategori: kategori.Kategori
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
                SrcGambar: 'http://127.0.0.1:5000/foto/article/'+req.file.filename
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
                SrcGambar: 'http://127.0.0.1:5000/foto/article/'+req.file.filename
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