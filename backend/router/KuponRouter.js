import express from 'express'
import multer from 'multer'
import path from 'path'
import { checkKupon, createKupon, deleteKupon, getDetailKupon, getDetailKuponAdmin, getKupon, getKuponAdmin, updateKupon } from '../controller/KuponController.js'

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './foto/kupon')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

const KuponRouter = express.Router()
KuponRouter.post('/', getKupon)
KuponRouter.post('/check', checkKupon)
KuponRouter.get('/:id', getDetailKupon)
KuponRouter.post('/admin', getKuponAdmin)
KuponRouter.post('/admin/:id', getDetailKuponAdmin)
KuponRouter.post('/', upload.single('SrcGambar'), createKupon)
KuponRouter.patch('/:id', upload.single('SrcGambar'), updateKupon)
KuponRouter.delete('/:id', deleteKupon)

export default KuponRouter