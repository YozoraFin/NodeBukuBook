import express from 'express'
import { createBroadcast, deleteBroadcast, getBroadcast, getDetailBroadcast, sendBroadcast, updateBroadcast } from '../controller/BroadcastController.js'

const BroadcastRouter = express.Router()

BroadcastRouter.get('/', getBroadcast)
BroadcastRouter.get('/:id', getDetailBroadcast)
BroadcastRouter.post('/', createBroadcast)
BroadcastRouter.patch('/:id', updateBroadcast)
BroadcastRouter.delete('/:id', deleteBroadcast)
BroadcastRouter.post('/send', sendBroadcast)

export default BroadcastRouter