import express from 'express'
import { checkout } from '../controller/CheckoutController.js'

const CheckoutRouter = express.Router()

CheckoutRouter.post('/', checkout)

export default CheckoutRouter