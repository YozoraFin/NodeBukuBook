import express from 'express'
import multer from 'multer'
import { createBanner, deleteBanner, getBanner, getDetailBanner, updateBanner } from '../controller/BannerController.js'
import path from 'path'

const BannerRouter = express.Router()
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './foto/banner')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

BannerRouter.get('/', getBanner)
BannerRouter.get('/:id', getDetailBanner)
BannerRouter.post('/', upload.single('banner'), createBanner)
BannerRouter.patch('/:id', upload.single('banner'), updateBanner)
BannerRouter.delete('/:id', deleteBanner)

export default BannerRouter