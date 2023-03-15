import express from 'express'
import db from './config/Database.js'
import cors from 'cors'
import bodyParser from 'body-parser';
import SiteConfigRouter from './router/SiteConfigRouter.js';
import SocialRouter from './router/SocialRouter.js';
import BannerRouter from './router/BannerRouter.js';
import ArticleRouter from './router/ArticleRouter.js';
import KategoriRouter from './router/KategoriRouter.js';
import BukuRouter from './router/BukuRouter.js';
import GenreRouter from './router/GenreController.js';
import SampulRouter from './router/SampulRouter.js';
import CustomerRouter from './router/CustomerRouter.js';
import KomentarRouter from './router/KomentarRouter.js';
import EmailRouter from './router/EmailRouter.js';
import CartRouter from './router/CartRouter.js';
import RajaOngkirRouter from './router/RajaOngkirRouter.js';
import CheckoutRouter from './router/CheckoutRouter.js';
import OrderRouter from './router/OrderRouter.js';
import client from './client/client.js';
import BroadcastRouter from './router/BroadcastRouter.js';
import { Server } from 'socket.io';
import http  from 'http'
import { getChat, getDetailChat, getNewMessage, getNextChat, getNextDetail, getUnreadNotif, sendChat } from './livechat/LiveChatController.js';

const app = express()
app.use(cors())
const hattp = http.Server(app)
const io = new Server(hattp, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

try {
    await db.authenticate();
    console.log('Berhasil terhubung dengan database')
} catch(error) {
    console.log(error)
}

io.on('connection', (socket) => {
    console.log('halo')

    client.on('message_create', (msg) => {
        getNewMessage(socket, msg)
    })
    
    client.on('message', (msg) => {
        getNewMessage(socket, msg)
    })

    socket.on('disconnect', () => {
        console.log('bai')
    })

    socket.on('getMessage', () => {
        getChat(socket)
    })

    socket.on('getNextMessage', async(data) => {
        getNextChat(socket, data)
    })

    socket.on('getDetail', (data) => {
        getDetailChat(socket, data)
    })

    socket.on('getNextDetail', (data) => {
        getNextDetail(socket, data)
    })

    socket.on('getUnreadNotif', () => {
        getUnreadNotif(socket)
    })

    socket.on('sendMessage', (data) => {
        sendChat(data)
    }) 

})

app.use(express.json());
app.use('/foto', express.static('foto'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/siteconfig', SiteConfigRouter)
app.use('/social', SocialRouter)
app.use('/banner', BannerRouter)
app.use('/artikel', ArticleRouter)
app.use('/kategori', KategoriRouter)
app.use('/buku', BukuRouter)
app.use('/genre', GenreRouter)
app.use('/sampul', SampulRouter)
app.use('/customer', CustomerRouter)
app.use('/komentar', KomentarRouter)
app.use('/email', EmailRouter)
app.use('/cart', CartRouter)
app.use('/rajaongkir', RajaOngkirRouter)
app.use('/checkout', CheckoutRouter)
app.use('/order', OrderRouter)
app.use('/broadcast', BroadcastRouter)

client.initialize();

hattp.listen(5000, () => {console.log('lesgo')})