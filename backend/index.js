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
import { deleteMessage, deleteMessageEveryone, deleteMessageMe, getChat, getDetailChat, getMessageByOffset, getNewMessage, getNextChat, getNextDetail, getUnreadNotif, replyMessage, sendChat } from './livechat/LiveChatController.js';
import http  from 'http'
import bot from './BotTele/telebot.js';
import KuponRouter from './router/KuponRouter.js';

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
    console.log('socket connected')
    
    socket.on('getMessage', () => {
        getChat(io.sockets)
    })
    
    socket.on('getNextMessage', async(data) => {
        getNextChat(io.sockets, data)
    })
    
    socket.on('getDetail', (data) => {
        getDetailChat(io.sockets, data)
        getUnreadNotif(io.sockets)
    })
    
    socket.on('getNextDetail', (data) => {
        getNextDetail(io.sockets, data)
    })
    
    socket.on('getUnreadNotif', () => {
        getUnreadNotif(io.sockets)
    })
    
    socket.on('sendingMessage', (data) => {
        sendChat(data)
    }) 
    
    socket.on('readChat', async(data) => {
        const contact = await client.getContactById(data.id)
        const chat = await contact.getChat()
        chat.sendSeen()
    })

    socket.on('sendReplyMessage', (data) => {
        replyMessage(data)
    })
    
    socket.on('deleteMessage', (data) => {
        deleteMessage(data)
    })
    
    socket.on('getMessageByOffset', (data) => {
        getMessageByOffset(io.sockets, data)
    })
    
    socket.on('disconnect', () => {
        console.log('socket Disconnected')
    })
})

client.on('message_create', (msg) => {
    if(!msg.isStatus) {
        getNewMessage(io.sockets, msg)
        getUnreadNotif(io.sockets)
        console.log('message created')
    }
})

client.on('message_revoke_me', (msg) => {
    deleteMessageMe(io.sockets, msg)
    console.log('message deleted for me')
})

client.on('message_revoke_everyone', (msg) => {
    deleteMessageEveryone(io.sockets, msg)
    console.log('message deleted for everyone')
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
app.use('/kupon', KuponRouter)

client.initialize();
// bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

hattp.listen(5000, () => {console.log('lesgo')})