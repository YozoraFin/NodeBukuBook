import express from 'express'
import multer from 'multer'
import path from 'path'
import { createArticle, deleteArticle, getArticle, getDetailArticle, updateArticle } from '../controller/ArticleController.js'

const ArticleRouter = express.Router()
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './foto/artikel')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

ArticleRouter.get('/', getArticle)
ArticleRouter.get('/:id', getDetailArticle)
ArticleRouter.post('/', upload.single('cover'), createArticle)
ArticleRouter.patch('/:id', upload.single('cover'), updateArticle)
ArticleRouter.delete('/:id', deleteArticle)

export default ArticleRouter