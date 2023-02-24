import SiteConfig from "../model/SiteConfigModel.js"

export const getSiteConfig = async (req, res) => {
    try {
        const siteconfig = await SiteConfig.findOne({
            attributes: ['Tentang', 'Alamat', 'NoTELP', 'Email', 'Map']
        });
        res.status(200).json({
            status: 200,
            data: siteconfig,
            message: 'OK'
        })
    } catch(error) {
        console.log(error)
    }
}

export const updateSiteConfig = async (req, res) => {
    try {
        const tes = await SiteConfig.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": 'sukses'
        })
    } catch(error) {
        console.log(error)
    }
}