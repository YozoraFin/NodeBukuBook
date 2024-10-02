import nodemailer from 'nodemailer'
import { EmailContact } from '../Email/Contact.js'
import dotenv from 'dotenv'
dotenv.config()

export const contactMail = async(req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'arjunamarcel25@gmail.com',
                pass: process.env.PASS_KEY
            },
            secure: true,
            connectionTimeout: 5*60*1000
        })

        var nama = req.body.Nama
        var email = req.body.Email
        var subject = req.body.Subject
        var pesan = req.body.Pesan

        const mailData = {
            from: email,
            to: 'arjunamarcel49@gmail.com',
            subject: subject,
            html: EmailContact(nama, subject, pesan)
        }

        transporter.sendMail(mailData, function(err, info) {
            if(err) {
                console.log(err)
                res.json({
                    status: 503,
                    message: 'Terjadi kesalahan ketika mencoba mengirimkan email, coba lagi nanti'
                })
            } else {
                console.log(info),
                res.json({
                    status: 200,
                    message: 'Email berhasil dikirimkan'
                })
            }
        })

    } catch (error) {
        console.log(error)
    }
}