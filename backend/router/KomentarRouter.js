import express from 'express'
import { sendKomentar } from '../controller/KomentarController.js'

const KomentarRouter = express.Router()
KomentarRouter.post('/send', sendKomentar)

export default KomentarRouter