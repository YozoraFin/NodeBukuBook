import express from 'express'
import { getAdminOrder, getAdminOrderDetail, getOrder, getOrderDetail } from '../controller/OrderController.js'

const OrderRouter = express.Router()

OrderRouter.post('/', getOrder)
OrderRouter.post('/detail/:id', getOrderDetail)
OrderRouter.post('/admin', getAdminOrder)
OrderRouter.post('/admin/:id', getAdminOrderDetail)

export default OrderRouter