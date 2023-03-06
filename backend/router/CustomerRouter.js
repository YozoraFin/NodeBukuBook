import express from 'express'
import multer from 'multer'
import { getCustomer, login, register, getCustomerNotif, updateCustomer } from '../controller/CustomerController.js'
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
CustomerRouter.post('/login', login)
CustomerRouter.post('/get', getCustomer)
CustomerRouter.post('/getnotif', getCustomerNotif)
CustomerRouter.post('/edit', upload.single('Profil'), updateCustomer)

export default CustomerRouter