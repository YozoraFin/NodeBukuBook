import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;
import client from "../client/client.js"
var totalMessage = 0

const getFileSize = (num) => {
    let mb = 1000000
    let kb = 1000
    let sz
    let a
    let b
    if(num > 1000000) {
        a = Math.floor(num/mb)
        b = Math.round((num%mb)/100000)
        if(b === 0 || a > 99) {
            b = ''
        } else {
            b = `.${b}`
        }
        sz = 'MB'
    } else if(num > 1000) {
        a = Math.floor(num/kb)
        b = Math.round((num%kb)/100)
        if(b === 0 || a > 99) {
            b = ''
        } else {
            b = `.${b}`
        }
        sz = 'kB'
    } else {
        a = num
        b = ''
        sz = 'B'
    }
    return `${a}${b} ${sz}`
}

export const getNewMessage = async(socket, msg) => {
    try {
        if(!msg.isStatus) {
            var chat = await msg.getChat()
            var chatFContact = await chat.getContact()
            var profile = await chatFContact.getProfilePicUrl()
            var id = chat.id
            var message = msg
            var unread = chat.unreadCount
            var name = chat.name
            var element = message
            var time
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
            let reply
            let replydata
            if(message.hasQuotedMsg) {
                reply = await message.getQuotedMessage()
                var chatreply = await reply.getChat()
                var link = ''
                var filename = ''
                var filesize = ''
                var mimetype = ''
                if(reply.hasMedia) {
                    var replymedia = await reply.downloadMedia()
                    link = 'data:'+replymedia.mimetype+';base64,'+replymedia.data
                    filesize = getFileSize(replymedia.filesize)
                    filename = replymedia.filename
                    mimetype = replymedia.mimetype
                }
                replydata = {
                    body: reply.body,
                    fromMe: reply.fromMe,
                    name: chatreply.name,
                    type: reply.type,
                    id: reply.id,
                    hasMedia: reply.hasMedia,
                    media: link,
                    filename: filename,
                    filesize: filesize,
                    mimetype: mimetype
                }
            }

            var link = ''
            var filename = ''
            var filesize = ''
            var mimetype = ''

            if(element.hasMedia && element.type !== 'revoked') {
                var mediadata = await message.downloadMedia()
                link = 'data:'+mediadata.mimetype+';base64,'+mediadata.data
                filename = mediadata.filename
                filesize = getFileSize(mediadata.filesize)
                mimetype = mediadata.mimetype
            }

            var body = {
                message: message.body,
                fromMe: message.fromMe,
                time: time,
                type: message.type,
                body: message.body,
                timestamp: message.timestamp,
                id: message.id,
                hasReply: message.hasQuotedMsg,
                reply: replydata,
                hasMedia: (message.hasMedia && message.type !== 'revoked'),
                media: link,
                filename: filename,
                filesize: filesize,
                mimetype: mimetype
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
        }
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
        var pinned = 0
        for (let index = 0; index < slice.length; index++) {
            const element = slice[index];
            if(element.pinned) {
                pinned += 1
            }
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
            data: dataMessage,
            pinned: pinned
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
        var contact = await client?.getContactById(data?.id)
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
            let reply
            let replydata
            if(element.hasQuotedMsg) {
                reply = await element.getQuotedMessage()
                var chatreply = await reply.getChat()
                var link = ''
                var filename = ''
                var filesize = ''
                var mimetype = ''
                if(reply.hasMedia) {
                    var replymedia = await reply.downloadMedia()
                    filesize = getFileSize(replymedia.filesize)
                    link = 'data:'+replymedia?.mimetype+';base64,'+replymedia?.data
                    filename = replymedia.filename
                    mimetype = replymedia.mimetype
                }

                replydata = {
                    body: reply.body,
                    fromMe: reply.fromMe,
                    name: chatreply.name,
                    type: reply.type,
                    id: reply.id,
                    hasMedia: reply.hasMedia,
                    media: link,
                    filename: filename,
                    filesize: filesize,
                    mimetype: mimetype
                }
            }

            var link = ''
            var filename = ''
            var filesize
            var mimetype = ''

            if(element.hasMedia && element.type !== 'revoked') {
                var mediadata = await element?.downloadMedia()
                link = 'data:'+mediadata?.mimetype+';base64,'+mediadata?.data
                filename = mediadata?.filename
                filesize = getFileSize(mediadata?.filesize)
                mimetype = mediadata?.mimetype
            }

            message.push({
                body: element.body,
                fromMe: element.fromMe,
                time: time,
                type: element.type,
                id: element.id,
                hasReply: element.hasQuotedMsg,
                reply: replydata,
                hasMedia: (element.hasMedia && element.type !== 'revoked'),
                media: link,
                filename: filename,
                filesize: filesize,
                mimetype: mimetype
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
            let reply
            let replydata
            if(element.hasQuotedMsg) {
                reply = await element.getQuotedMessage()
                var chatreply = await reply.getChat()
                var link = ''
                var filename = ''
                var filesize = ''
                var mimetype = ''
                if(reply.hasMedia) {
                    var replymedia = await reply.downloadMedia()
                    link = 'data:'+replymedia.mimetype+';base64,'+replymedia.data
                    filename = replymedia.filename
                    filesize = getFileSize(replymedia.filesize)
                    mimetype = replymedia.mimetype
                }
                replydata = {
                    body: reply.body,
                    fromMe: reply.fromMe,
                    name: chatreply.name,
                    type: reply.type,
                    id: reply.id,
                    hasMedia: reply.hasMedia,
                    media: link,
                    filename: filename,
                    filesize: filesize,
                    mimetype: mimetype
                }
            }

            var link = ''
            var filename = ''
            var filesize = ''
            var mimetype = ''

            if(element.hasMedia && element.type !== 'revoked') {
                var mediadata = await element.downloadMedia()
                link = 'data:'+mediadata.mimetype+';base64,'+mediadata.data
                filename = mediadata.filename
                filesize = getFileSize(mediadata.filesize)
                mimetype = mediadata.mimetype
            }

            message.push({
                body: element.body,
                fromMe: element.fromMe,
                time: time,
                timestamp: element.timestamp,
                type: element.type,
                id: element.id,
                hasReply: element.hasQuotedMsg,
                reply: replydata,
                hasMedia: (element.hasMedia && element.type !== 'revoked'),
                media: link,
                filename: filename,
                filesize: filesize,
                mimetype: mimetype
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
    setTimeout(async() => {
        try {
            var chats = await client.getChats()
            var total = 0

            for (let index = 0; index < chats.length; index++) {
                const element = chats[index];
                if(element.unreadCount > 0) {
                    total += 1
                }
            }
            socket.emit('sendUnreadNotif', {
                notif: total
            })
        } catch (error) {
            console.log(error)
        }
    }, 1000);
}

export const sendChat = async(data) => {
    try {
        if(data.hasMedia) {
            var media = await new MessageMedia(data.type, data.media.toString('base64'), data.filename)
            await client.sendMessage(data.id, data.message, {media: media, sendMediaAsDocument: data.isDocument, caption: data.message})
        } else {
            client.sendMessage(data.id, data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export const replyMessage = async(data) => {
    try {
        const chat = await client.getChatById(data.chatId)
        const messages = await chat.fetchMessages({limit: data.page*50+50})
        let message
        for (let index = 0; index < messages.length; index++) {
            const element = messages[index];
            if(element.id.id === data.messageId) {
                message = element
            }
        }
        if(data.hasMedia) {
            var media = await new MessageMedia(data.type, data.media.toString('base64'), data.filename)
            await message.reply(data.message, data.chatId, {media: media, sendMediaAsDocument: data.isDocument, caption: data.message})
        } else {
            message.reply(data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteMessage = async(data) => {
    try {
        const chat = await client.getChatById(data.chatId)
        const messages = await chat.fetchMessages({limit: data.page*50+50})
        let message
        for (let index = 0; index < messages.length; index++) {
            const element = messages[index];
            if(element.id.id === data.messageId) {
                message = element
            }
        }
        message?.delete(data.everyone)
    } catch (error) {
        console.log(error)
    }
}

const getInfoDeleted = async(msg) => {
    var chat = await msg.getChat()
    var chatFContact = await chat.getContact()
    var profile = await chatFContact.getProfilePicUrl()
    var id = chat.id
    var message = await chat.fetchMessages({limit: 1})
    var unread = chat.unreadCount
    var name = chat.name
    var element = message
    var time
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
    var body = {
        message: message[0].body,
        fromMe: message[0].fromMe,
        time: time,
        type: message[0].type,
        body: message[0].body,
        timestamp: message[0].timestamp,
        id: message[0].id
    }
    var datacontact = {
        nama: name,
        profile: profile,
        pesan: body,
        unread: unread,
        id: id
    }
    return datacontact
}

export const deleteMessageEveryone = async(socket, msg) => {
    try {
        const chat = await msg.getChat()
        const datauser = await getInfoDeleted(msg)

        socket.emit('messageDeleted', {
            id: chat.id,
            data: datauser
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteMessageMe = async(socket, msg) => {
    try {
        const chat = await msg.getChat()
        const datauser = await getInfoDeleted(msg)

        socket.emit('messageDeleted', {
            id: chat.id,
            data: datauser
        })
    } catch (error) {
        console.log(error)
    }
}

export const getMessageByOffset = async(socket, data) => {
    try {
        if(data.id !== '') {
            totalMessage = 0
            var contact = await client.getContactById(data.id)
            var chat = await contact.getChat()
            var fMessage = await chat.fetchMessages({limit: data.page*50})
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
                let reply
                let replydata
                if(element.hasQuotedMsg) {
                    reply = await element.getQuotedMessage()
                    var chatreply = await reply.getChat()
                    var link = ''
                    var filename = ''
                    var filesize = ''
                    var mimetype = ''
                    if(reply.hasMedia) {
                        var replymedia = await reply.downloadMedia()
                        link = 'data:'+replymedia?.mimetype+';base64,'+replymedia?.data
                        filename = replymedia?.filename
                        filesize = getFileSize(replymedia?.filesize)
                        mimetype = replymedia?.mimetype
                    }
                    replydata = {
                        body: reply.body,
                        fromMe: reply.fromMe,
                        name: chatreply.name,
                        type: reply.type,
                        id: reply.id,
                        hasMedia: reply.hasMedia,
                        media: link,
                        filename: filename,
                        filesize: filesize,
                        mimetype: mimetype
                    }
                }

                var link = ''
                var filename = ''
                var filesize =''
                var mimetype =''
    
                if(element.hasMedia && element.type !== 'revoked') {
                    var mediadata = await element.downloadMedia()
                    link = 'data:'+mediadata.mimetype+';base64,'+mediadata.data
                    filename = mediadata.filename
                    filesize = getFileSize(mediadata.filesize)
                    mimetype = mediadata.mimetype
                }

                message.push({
                    body: element.body,
                    fromMe: element.fromMe,
                    time: time,
                    type: element.type,
                    id: element.id,
                    hasReply: element.hasQuotedMsg,
                    reply: replydata,
                    hasMedia: (element.hasMedia && element.type !== 'revoked'),
                    media: link,
                    filename: filename,
                    filesize: filesize,
                    mimetype: mimetype
                })
            }
        
            var dataDetail = {
                nama: chat.name,
                pesan: message,
                profile: profile
            }
        
            socket.emit('sendDetailwOffset', {
                data: dataDetail
            })
        }
    } catch (error) {
        console.log(error)
    }
}