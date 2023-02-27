import express from 'express'
import { createKategori, deleteKategori, getDetailKategori, getKategori, updateKategori } from '../controller/KategoriController.js'

const KategoriRouter = express.Router()

KategoriRouter.get('/', getKategori)
KategoriRouter.get('/:id', getDetailKategori)
KategoriRouter.post('/', createKategori)
KategoriRouter.patch('/:id', updateKategori)
KategoriRouter.delete('/:id', deleteKategori)

export default KategoriRouter