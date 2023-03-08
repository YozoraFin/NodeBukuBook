import express from 'express'
import { getCity, getOngkir, getProvince } from '../controller/RajaOngkirController.js'

const RajaOngkirRouter = express.Router()

RajaOngkirRouter.get('/provinsi', getProvince)
RajaOngkirRouter.post('/kota', getCity)
RajaOngkirRouter.post('/ongkir', getOngkir)

export default RajaOngkirRouter