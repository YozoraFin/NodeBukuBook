import express from 'express'
import multer from 'multer'
import { getCustomer, login, register, getCustomerNotif, updateCustomer, getOTP, verifikasiOTP, tes, fillCustomer, loginOtp, getAllCustomer } from '../controller/CustomerController.js'
import path from 'path'

const CustomerRouter = express.Router()
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './foto/customer')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

CustomerRouter.post('/register', register)
CustomerRouter.post('/getotp', getOTP)
CustomerRouter.post('/verification', verifikasiOTP)
CustomerRouter.post('/login', login)
CustomerRouter.post('/loginotp', loginOtp)
CustomerRouter.post('/get', getCustomer)
CustomerRouter.post('/getnotif', getCustomerNotif)
CustomerRouter.post('/edit', upload.single('Profil'), updateCustomer)
CustomerRouter.post('/fill', fillCustomer)
CustomerRouter.post('/getall', getAllCustomer)
CustomerRouter.post('/tes', tes)

export default CustomerRouter