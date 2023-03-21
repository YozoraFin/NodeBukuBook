import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io';
import { deleteMessage, deleteMessageEveryone, deleteMessageMe, getChat, getDetailChat, getMessageByOffset, getNewMessage, getNextChat, getNextDetail, getUnreadNotif, sendChat } from '../livechat/LiveChatController.js';

const app = express()
app.use(cors())
const hattp = http.Server(app)
let socketIo = new Server(hattp, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

socketIo.on('connection', (socket) => {
    console.log('socket connected')

    client.on('message_create', (msg) => {
        getNewMessage(socket, msg)
        getUnreadNotif(socket)
        console.log('message created')
    })
    
    client.on('message_revoke_me', (msg) => {
        deleteMessageMe(socket, msg)
    })
    
    client.on('message_revoke_everyone', (msg) => {
        deleteMessageEveryone(socket, msg)
    })
    
    socket.on('getMessage', () => {
        getChat(socket)
    })
    
    socket.on('getNextMessage', async(data) => {
        getNextChat(socket, data)
    })
    
    socket.on('getDetail', (data) => {
        getDetailChat(socket, data)
        getUnreadNotif(socket)
    })
    
    socket.on('getNextDetail', (data) => {
        getNextDetail(socket, data)
    })
    
    socket.on('getUnreadNotif', () => {
        getUnreadNotif(socket)
    })
    
    socket.on('sendingMessage', (data) => {
        sendChat(data)
    }) 
    
    socket.on('readChat', async(data) => {
        const contact = await client.getContactById(data.id)
        const chat = await contact.getChat()
        chat.sendSeen()
    })
    
    socket.on('deleteMessage', (data) => {
        deleteMessage(socket, data)
    })
    
    socket.on('getMessageByOffset', (data) => {
        getMessageByOffset(socket, data)
    })
    
    socket.on('disconnect', () => {
        console.log('socket Disconnected')
    })
})

export default socketIo