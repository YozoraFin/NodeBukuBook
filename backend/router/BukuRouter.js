import express from 'express'
import { getBuku, getDetailBuku } from '../controller/BukuController.js'

const BukuRouter = express.Router()

BukuRouter.get('/', getBuku)
BukuRouter.get('/:id', getDetailBuku)

export default BukuRouter