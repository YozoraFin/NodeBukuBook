import client from "../client/client.js"
var totalMessage = 0

export const getNewMessage = async(socket, msg) => {
    try {
        var contact = await msg.getContact()
        var profile = await contact.getProfilePicUrl()
        var chat = await msg.getChat()
        var id = chat.id
        var message = await chat.fetchMessages({limit: 1})
        var unread = chat.unreadCount
        var name = chat.name
        var body = {
            message: message[0].body,
            fromMe: message[0].fromMe,
            time: message[0].timestamp,
            type: message[0].type
        }
        var datacontact = {
            nama: name,
            profile: profile,
            pesan: body,
            unread: unread,
            id: id
        }
        socket.emit('sendNewMessage', {
            data: datacontact
        })
    } catch (error) {
        console.log(error)
    }
}

export const getChat = async(socket) => {
    try {
        var chats = await client.getChats()
        var slice = chats.slice(0, 0 + 20)
        var message
        var profile
        var body
        var dataMessage = []
        for (let index = 0; index < slice.length; index++) {
            const element = slice[index];
            profile = await (await element.getContact()).getProfilePicUrl()
            message = await element.fetchMessages({limit: 1})
            body = {
                message: message[0].body,
                fromMe: message[0].fromMe,
                time: message[0].timestamp,
                type: message[0].type
            }
            dataMessage.push({
                nama: element.name,
                profile: profile,
                pesan: body,
                unread: element.unreadCount,
                id: element.id
            })
        }
        socket.emit('sendMessage', {
            data: dataMessage
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const getNextChat = async(socket, data) => {
    try {
        var offset = Number(data.page) * 20
        var chats = await client.getChats()
        var slice = chats.slice(offset, offset + 20)
        var total = Math.ceil(chats.length / 20)
        var message
        var profile
        var body
        var dataMessage = []
        if(data.page <= total) {
            for (let index = 0; index < slice.length; index++) {
                const element = slice[index];
                profile = await (await element.getContact()).getProfilePicUrl()
                message = await element.fetchMessages({limit: 1})
                body = {
                    message: message[0]?.body,
                    fromMe: message[0]?.fromMe,
                    time: message[0]?.timestamp,
                    type: message[0]?.type
                }
                dataMessage.push({
                    nama: element?.name,
                    profile: profile,
                    pesan: body,
                    unread: element?.unreadCount,
                    id: element?.id
                })
            }
            socket.emit('sendNextMessage', {
                data: dataMessage,
                next: true
            })
        } else {
            socket.emit('sendNextMessage', {
                data: dataMessage,
                next: false
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getDetailChat = async(socket, data) => {
    try {
        totalMessage = 0
        var contact = await client.getContactById(data.id)
        var chat = await contact.getChat()
        var fMessage = await chat.fetchMessages({limit: 50})
        var message = []
        var profile = await contact.getProfilePicUrl()
        var time
        chat.sendSeen()
    
        for (let index = 0; index < fMessage.length; index++) {
            const element = fMessage[index];
            const month = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
            const d = new Date(element.timestamp*1000)
            const hari = Date.now()/1000 - 60*60*24
            var minute
            if(d.getMinutes() < 10) {
                minute = `0${d.getMinutes()}`
            } else {
                minute = `${d.getMinutes()}`
            }
            if(element.timestamp < hari) {
                time = `${d.getDate()} ${month[d.getMonth()]}, ${d.getHours()}:${minute} `
            } else {
                time = `${d.getHours()}:${minute}`
            }
            message.push({
                body: element.body,
                fromMe: element.fromMe,
                time: time
            })
        }
    
        var dataDetail = {
            nama: chat.name,
            pesan: message,
            profile: profile
        }
    
        socket.emit('sendDetail', {
            data: dataDetail
        })
    } catch (error) {
        console.log(error)
    }
}

export const getNextDetail = async(socket, data) => {
    try {
        var offset = data.page*50
        var contact = await client.getContactById(data.id)
        var chat = await contact.getChat()
        var fMessage = await chat.fetchMessages({limit: offset+50})
        var message = []
        var profile = await contact.getProfilePicUrl()
        var time
        var length
        var next = true
        if(totalMessage !== fMessage.length) {
            totalMessage = fMessage.length
        } else {
            next = false
        }

        if(fMessage.length % 50 === 0) {
            length = 50
        } else {
            length = fMessage % 50
            next = false
        }
        chat.sendSeen()

        for (let index = 0; index < length; index++) {
            const element = fMessage[index];
            const month = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
            const d = new Date(element.timestamp*1000)
            const hari = Date.now()/1000 - 60*60*24
            var minute
            if(d.getMinutes() < 10) {
                minute = `0${d.getMinutes()}`
            } else {
                minute = `${d.getMinutes()}`
            }
            if(element.timestamp < hari) {
                time = `${d.getDate()} ${month[d.getMonth()]}, ${d.getHours()}:${minute} `
            } else {
                time = `${d.getHours()}:${minute}`
            }
            message.push({
                body: element.body,
                fromMe: element.fromMe,
                time: time,
                timestamp: element.timestamp
            })
        }

        message.sort((a, b) => {(a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0)})
        message.reverse()
        var dataDetail = {
            nama: chat.name,
            pesan: message,
            profile: profile
        }
    
        socket.emit('sendNextDetail', {
            data: dataDetail,
            next: next
        })
    } catch (error) {
        console.log(error)
    }
}

export const getUnreadNotif = async(socket) => {
    try {
        var chats = await client.getChats()
        var total = 0

        for (let index = 0; index < chats.length; index++) {
            const element = chats[index];
            if(element.unreadCount > 0) {
                total += 1
            }
        }
        console.log(total)
        socket.emit('sendUnreadNotif', {
            notif: total
        })
    } catch (error) {
        console.log(error)
    }
}

export const sendChat = async(data) => {
    try {
        client.sendMessage(data.id, data.message)
    } catch (error) {
        console.log(error)
    }
}