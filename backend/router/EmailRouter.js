import express from 'express'
import { contactMail } from '../controller/EmailController.js'

const EmailRouter = express.Router()

EmailRouter.post('/contact', contactMail)

export default EmailRouter