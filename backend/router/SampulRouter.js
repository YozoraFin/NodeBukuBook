import express from 'express'
import { deleteSampul, getSampul } from '../controller/SampulController.js'

const SampulRouter = express.Router()

SampulRouter.get('/:id', getSampul)
SampulRouter.delete('/:id', deleteSampul)

export default SampulRouter