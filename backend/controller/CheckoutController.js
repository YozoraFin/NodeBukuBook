import AksesToken from "../model/AksesTokenModel.js"
import Buku from "../model/BukuModel.js"
import Customer from "../model/CustomerModel.js"
import OrderDetail from "../model/OrderDetailModel.js"
import Order from "../model/OrderModel.js"
import nodemailer from "nodemailer"
import { InvoiceMail } from "../Email/Invoice.js"
import client from "../client/client.js"

export const checkout = async(req, res) => {
    try {
        const separator = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        var body = req.body
        const customer = await Customer.findOne({
            include: [
                {
                    model: AksesToken,
                    as: 'Token',
                    where: {
                        AksesToken: body.AksesToken
                    }
                }
            ]
        })
        if(!customer) {
            res.json({
                status: 404,
                message: 'User tidak ditemukan'
            })
        } else {
            var invoice = `INV-${customer.id}-${Date.now()}`
            var subtotal = 0
            var next = true
            for (let index = 0; index < body.Data.length; index++) {
                const element = body.Data[index];
                subtotal += element.subtotal
                const buku = await Buku.findOne({
                    where: {
                        ID: element.id
                    }
                }) 
                if(element.qty > buku.Stok) {
                    next = false
                }
            }

            if(next) {
                const month = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
                const date = new Date()
                var tanggal = `${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}`
                var object = {
                    Total: body.Total,
                    InvoiceNumber: invoice,
                    CustomerID: customer.id,
                    Alamat: body.Alamat,
                    NoTelp: body.NoTelp,
                    Email: body.Email,
                    Nama: body.Nama,
                    Catatan: body.Catatan,
                    Kodepos: body.Kodepos,
                    Provinsi: body.Provinsi,
                    Kurir: body.Kurir,
                    Ongkir: body.Ongkir,
                    Subtotal: subtotal,
                    Kota: body.Kota,
                    Tanggal: tanggal
                }

                const order = await Order.create(object)

                var datable = []

                for (let index = 0; index < body.Data.length; index++) {
                    const element = body.Data[index];
                    const objectdetail = {
                        Quantity: element.qty,
                        Subtotal: element.subtotal,
                        BukuID: element.id,
                        OrderID: order.id,
                    }

                    const bukud = await Buku.findOne({
                        where: {
                            ID: element.id
                        }
                    })

                    datable.push(`
                        <tr>
                            <td style="padding: 0; border: 1px solid #333333;
                                padding: 10px;" class="tddetail" align="center">
                                `+(index+1)+`
                            </td>
                            <td style="padding: 0; border: 1px solid #333333;
                                padding: 10px;" class="tddetail" align="center">
                                `+bukud.Judul+`
                            </td>
                            <td style="padding: 0; border: 1px solid #333333;
                                padding: 10px;" class="tddetail" align="center">
                                `+element.qty+`
                            </td>
                            <td style="padding: 0; border: 1px solid #333333;
                                padding: 10px;" class="tddetail" align="center">
                                Rp `+separator(element.subtotal)+`
                            </td>
                        </tr>
                    `)

                    const objectbuku = {
                        Stok: bukud.Stok - element.qty
                    }

                    await Buku.update(objectbuku, {
                        where: {
                            ID: element.id
                        }
                    })

                    await OrderDetail.create(objectdetail)
                }

                let datatable =``
                let messagebuku = ``
                
                await Promise.all(body.Data.map(async(dat, index) => {
                    const bukudata = await Buku.findOne({
                        where: {
                            ID: dat.id
                        }
                    })
                    datatable +=`
                        <tr>
                            <td style="padding: 0; border: 1px solid #333333;
                                padding: 10px;" class="tddetail" align="center">
                                `+(index+1)+`
                            </td>
                            <td style="padding: 0; border: 1px solid #333333;
                                padding: 10px;" class="tddetail" align="center">
                                `+bukudata.Judul+`
                            </td>
                            <td style="padding: 0; border: 1px solid #333333;
                                padding: 10px;" class="tddetail" align="center">
                                `+dat.qty+`
                            </td>
                            <td style="padding: 0; border: 1px solid #333333;
                                padding: 10px;" class="tddetail" align="center">
                                Rp `+separator(dat.subtotal)+`
                            </td>
                        </tr>
                    `
                    messagebuku += `${dat.qty}x ${bukudata.Judul}\n@Rp ${separator(dat.subtotal)}\n\n`
                }))

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'arjunamarcel25@gmail.com',
                        pass: 'brtioyjxtzgxcyui'
                    },
                    secure: true,
                    connectionTimeout: 5*60*1000
                })

                const mailData = {
                    from: 'bukubook@gmail.com',
                    to: body.Email,
                    subject: 'Invoice',
                    html: InvoiceMail(body.Nama, body.Alamat, body.NoTelp, invoice, tanggal, datatable, separator(body.Ongkir), separator(body.Total), body.Email)
                }
                
                transporter.sendMail(mailData, function(err, info) {
                    if(err) {
                        console.log(err)
                        res.json({
                            status: 503,
                            message: 'Terjadi kesalahan pada server'
                        })
                    } else {
                        console.log(info)
                        res.json({
                            status: 200,
                            message: 'Berhasil melakukan checkout',
                            OrderID: order.id
                        })
                    }
                })

                const wmessage = `Terima kasih telah menggunakan layanan BukuBook. Saat ini pesananmu sedang di proses, berikut adalah detail pesananmu\n\nInformasi Order:\nInvoice: ${invoice}\nTanggal: ${tanggal}\nTotal: Rp ${separator(body.Total)}\n\nInformasi Pembeli:\nNama: ${body.Nama}\nTelp: ${body.NoTelp}\nEmail: ${body.Email}\n\nAlamat Tujuan:\nKota: ${body.Kota}\nJalan: ${body.Alamat}\nKodepos: ${body.Kodepos}\n\nBuku:\n${messagebuku}Subtotal: Rp ${separator(subtotal)}\nOngkir: Rp ${separator(body.Ongkir)}\nTotal: Rp ${separator(body.Total)}\n\nCatatan: _${body.Catatan}_`
                client.sendMessage('6287888502866@c.us', wmessage)

            } else {
                res.json({
                    status: 400,
                    message: 'Barang yang pesan melebihi stok'
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}