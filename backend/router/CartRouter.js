import express from 'express'
import { addCart, getCart, removeAllCart, removeCart, updateCart } from '../controller/CartController.js'

const CartRouter = express.Router()

CartRouter.post('/', getCart)
CartRouter.post('/add', addCart)
CartRouter.post('/update', updateCart)
CartRouter.post('/remove', removeCart)
CartRouter.post('/removeall', removeAllCart)

export default CartRouter