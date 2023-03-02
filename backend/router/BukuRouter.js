import express from 'express'
import multer from 'multer'
import { createBuku, deleteBuku, getBestBuku, getBuku, getDetailBuku, getRekomendedBuku, updateBuku } from '../controller/BukuController.js'
import path from 'path'

const BukuRouter = express.Router()
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './foto/buku')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

BukuRouter.get('/', getBuku)
BukuRouter.get('/rekomended', getRekomendedBuku)
BukuRouter.get('/best', getBestBuku)
BukuRouter.get('/:id', getDetailBuku)
BukuRouter.post('/', upload.array('sampul'), createBuku)
BukuRouter.patch('/:id', upload.array('sampul'), updateBuku)
BukuRouter.delete('/:id', deleteBuku)


export default BukuRouter