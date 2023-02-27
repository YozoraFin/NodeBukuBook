import Banner from "../model/BannerModel.js"

export const getBanner = async(req, res) => {
    try {
        const banner = await Banner.findAll({
            attributes: ['id', 'Judul', 'Deskripsi', 'SrcBanner', 'NameBanner']
        });
        res.status(200).json({
            status: 200,
            data: banner,
            message: 'OK'
        })
    } catch(error) {
        console.log(error)
    }
}

export const getDetailBanner = async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'Judul', 'Deskripsi', 'SrcBanner', 'NameBanner']
        })
        res.status(200).json({
            status: 200,
            data: banner,
            message: 'Ok'
        })
    } catch(error) {
        console.log(error)
    }
}

export const createBanner = async(req, res) => {
    try {
        if(!req.file) {
            await Banner.create(req.body);
            res.json({
                status: 200,
                message: 'Ok'
            })
        } else {
            var newVal = {
                Judul: req.body.Judul,
                Deskripsi: req.body.Deskripsi,
                SrcBanner: 'http://127.0.0.1:5000/foto/banner/' + req.file.filename,
                NameBanner: req.body.NameBanner
            }
            await Banner.create(newVal)
            res.json({
                status: 200,
                message: 'OK'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateBanner = async(req, res) => {
    try {
        if(!req.file) {
            await Banner.update(req.body, {
                where: {
                    id: req.params.id
                }
            })
            res.json({
                status: 200,
                message: 'OK'
            })
        } else {
            var newVal = {
                Judul: req.body.Judul,
                Deskripsi: req.body.Deskripsi,
                SrcBanner: 'http://127.0.0.1:5000/foto/banner/' + req.file.filename,
                NameBanner: req.body.NameBanner
            }
            await Banner.update(newVal, {
                where: {
                    id: req.params.id
                }
            })
            res.json({
                status: 200,
                message: 'Ok'
            })
        }   
    } catch(error) {
        console.log(error)
    }
}

export const deleteBanner = async(req, res) => {
    try {
        await Banner.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch(error) {
        console.log(error)
    }
}