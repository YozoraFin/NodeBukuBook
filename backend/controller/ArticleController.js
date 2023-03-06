import Article from "../model/ArticleModel.js"
import Customer from "../model/CustomerModel.js"
import Kategori from "../model/KategoriModel.js"
import Komentar from "../model/KomentarModel.js"

export const getArticle = async(req, res) => {
    try {
        let articledata
        if(!req.query.kategori && req.query.penulis) {
            articledata = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar', 'Tanggal'],
                where: {
                    Penulis: req.query.penulis
                },
                include: [{
                    model: Kategori,
                    as: 'Kategori'
                }],
                order: [
                    ['id', 'DESC']
                ]
            })
        } else if(!req.query.penulis && req.query.kategori) {
            articledata = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar', 'Tanggal'],
                include: [{
                    model: Kategori,
                    where: {
                        Kategori: req.query.kategori
                    },
                    as: 'Kategori'
                }],
                order: [
                    ['id', 'DESC']
                ]
            })
        } else {
            articledata = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar', 'Tanggal'],
                include: [{
                    model: Kategori,
                    as: 'Kategori'
                }],
                order: [
                    ['id', 'DESC']
                ]
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
            attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar', 'Tanggal'],
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Komentar,
                    as: 'Komentar',
                    attributes: ['Komentar', 'Tanggal'],
                    include: [
                        {
                            model: Customer,
                            as: 'Customer',
                            attributes: ['NamaLengkap', 'Profil']
                        }
                    ],
                    separate: true,
                    order: [
                        ['ID', 'DESC']
                    ]
                }
            ]
        })
        const fullarticle = await Article.findAll({
            attributes: ['id', 'Judul', 'NamaGambar']
        })
        let count = 1
        let next = {
            id: 0
        }
        let prev = {
            id: 0
        }
        for (let index = 0; index < fullarticle.length; index++) {
            const element = fullarticle[index].id;
            if(Number(req.params.id) === element) {
                count = index
            }
        }
        if(count < fullarticle.length-1) {
            next = fullarticle[count+1]
        }
        if(count !== 0) {
            prev = fullarticle[count-1]
        }
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
        let customer = []
        let tanggal = []
        for (let index = 0; index < article.Komentar.length; index++) {
            const element = article.Komentar[index];
            customer.push(element.Customer)
            tanggal.push(element.Tanggal)
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
            NamaGambar: article.NamaGambar,
            Tanggal: article.Tanggal,
            Next: next,
            Prev: prev,
            Komentar: article.Komentar,
            JumlahKomen: article.Komentar.length
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
            const month = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
            const date = new Date()
            var newVal = {
                Judul: req.body.Judul,
                Isi: req.body.Isi,
                Penulis: req.body.Penulis,
                Teaser: req.body.Teaser,
                KategoriID: req.body.KategoriID,
                SrcGambar: 'http://127.0.0.1:5000/foto/artikel/'+req.file.filename,
                NamaGambar: req.body.NamaGambar,
                Tanggal: `${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}` 
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
        await Komentar.destroy({
            where: {
                ArticleID: req.params.id
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