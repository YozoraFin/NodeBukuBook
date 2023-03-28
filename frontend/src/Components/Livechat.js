import React, { Fragment, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import SkeletonChat from './SkeletonChat.js'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import RingLoader from "react-spinners/RingLoader.js";
import Popover from '@mui/material/Popover';
import linkifyHtml from "linkify-html";

export default function Livechat({ socket }) {
    const [message, setMessage] = useState([])
    const [newMessage, setNewMessage] = useState(true)
    const [chatScroll, setchatScroll] = useState(0)
    const [moreChat, setMoreChat] = useState(true)
    const [loadingChatNext, setLoadingChatNext] = useState(false)
    const [open, setOpen] = useState(false)
    const [chat, setChat] = useState({})
    const [loadingChat, setLoadingChat] = useState(true)
    const [idChat, setIdChat] = useState({
        id: '',
        index: 0
    })
    const [loadingMessage, setLoadingMessage] = useState(false)
    const [loadingNextMessage, setLoadingNextMessage] = useState(false)
    const [offsetChat, setOffsetChat] = useState(0)
    const [offsetMessage, setOffsetMessage] = useState(0)
    const [moreMessage, setMoreMessage] = useState(true)
    const [heightStatus, setHeightStatus] = useState(true)
    const [selectedMedia, setSelectedMedia] = useState('')
    const [selectedDocument, setSelectedDocument] = useState('')
    const [replyMessage, setReplyMessage] = useState({
        content: '',
        id: '',
        hasMedia: false,
        media: '',
        fromMe: false,
        type: ''
    })
    const [popMedia, setPopMedia] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const curIdChat = useRef({
        id: '',
        index: 0
    })
    const curChat = useRef({})
    const curPin = useRef(0)
    const MySwal = withReactContent(Swal)
    
    const getMessage = () => {
        socket.emit('getMessage', {
            page: 0
        })
        socket.on('sendMessage', (data) => {
            setMessage(data.data)
            curPin.current = data.pinned
            setLoadingChat(false)
        })
    }

    function debounce(func, wait, immediate) {
        var timeout;
      
        return function executedFunction() {
          var context = this;
          var args = arguments;
              
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
      
          var callNow = immediate && !timeout;
          
          clearTimeout(timeout);
      
          timeout = setTimeout(later, wait);
          
          if (callNow) func.apply(context, args);
        };
    };

    const handleScrollChat = () => {
        if(!loadingChat && !loadingChatNext && moreChat) {
            var element = document.getElementById('plist')
            var scroll = Math.ceil(document.getElementById('plist')?.scrollTop)
            if(Math.abs(element?.scrollHeight - element?.clientHeight - element?.scrollTop) < 100) {
                setchatScroll(scroll)
                var page = offsetChat + 1
                if(page > offsetChat) {
                    socket.emit('getNextMessage', {
                        page: page
                    })
                    setOffsetChat(page)
                    setLoadingChatNext(true)
                }
            } 
        }
    }

    var scrolling = debounce(handleScrollChat, 200)

    const getDetailMessage = () => {
        setOffsetMessage(0)
        setMoreMessage(true)
        socket.emit('getUnreadNotif', {})
        setOffsetMessage(0)
        socket.emit('getDetail', {
            id: idChat.id
        })
        socket.on('sendDetail', (data) => {
            setOpen(true)
            setChat(data.data)
            curChat.current = data.data
            setTimeout(() => {
                var elementz = document.getElementById('chat-history')
                elementz?.scrollTo(0, 200000)
            }, 200);
            setLoadingMessage(false)
        })
    }

    const handleScrollDetail = () => {
        var scroll = Math.ceil(document.getElementById('chat-history')?.scrollTop)
        if(!loadingMessage && !loadingNextMessage && moreMessage && selectedDocument === '' && selectedMedia === '') {
            if(scroll === 0) {
                var page = offsetMessage + 1
                socket.emit('getNextDetail', {
                    page: page,
                    id: idChat.id
                })
                setLoadingNextMessage(true)
                setOffsetMessage(page)
            }
        }
    }

    var scrollDetail = debounce(handleScrollDetail, 200)

    const handleMediaSelect = async() => {
        var files = document.getElementById('messagemedia')?.files
        var base64media = ''

        if(files.length > 0) {
            base64media = await getBase64File(files[0])
        }
        setSelectedMedia(base64media)
        setHeightStatus(!heightStatus)
        setPopMedia(false)
    }

    const handleDocumentSelect = () => {
        var files = document.getElementById('messagedocument')?.files[0]
        setSelectedDocument(files.name)
        setHeightStatus(!heightStatus)
        setPopMedia(false)
    }

    const getBase64File = (file) => {
        return new Promise((resolve) => {
            const media = file
            const reader = new FileReader()
            reader.onloadend = () => {
                const testResult = reader.result
                resolve(testResult)
            }
            reader.readAsDataURL(media)
        })
    }

    const handleSubmitMessage = (e) => {
        e.preventDefault()
        var files = document.getElementById('messagemedia')?.files[0]
        var documents = document.getElementById('messagedocument')?.files[0]
        var media
        var filename = ''
        var message = document.getElementById('message')?.value
        if(message !== '' || selectedMedia !== '' || selectedDocument !== '') {
            var hasMedia = false
            var isDocument = false
            if(selectedMedia !== '' || selectedDocument !== '') {
                hasMedia = true
                if(selectedDocument !== '') {
                    isDocument = true
                    media = documents
                    filename = documents.name
                } else {
                    media = files
                    filename = files.name
                }
            }
            if(message === '') {
                message = ''
            }

            if(replyMessage.id === '' && replyMessage.content === '') {
                socket.emit('sendingMessage', {
                    id: idChat.id,
                    message: message,
                    media: media,
                    hasMedia: hasMedia,
                    type: files?.type,
                    isDocument: isDocument,
                    filename: filename
                })
            } else {
                socket.emit('sendReplyMessage', {
                    chatId: idChat.id,
                    message: message,
                    messageId: replyMessage.id,
                    media: media,
                    hasMedia: hasMedia,
                    type: files?.type,
                    isDocument: isDocument,
                    filename: filename
                })
            }
            setReplyMessage({
                id: '',
                content: '',
                hasMedia: false,
                media: ''
            })
            document.getElementById('message').value = ''
            document.getElementById('messagemedia').value = null
            document.getElementById('messagedocument').value = null
            setSelectedMedia('')
            setSelectedDocument('')
            setHeightStatus(!heightStatus)
            setTimeout(() => {
                document.getElementById(`chat-history`).scrollTo(0, 2000000)
            }, 500);
        }
    }
    
    const getNewMessage = (id, data) => {
        var dataVes = data
        var dmessage = message
        const isExist = (k) => {
            if(k.id._serialized === id) {
                return true
            }
            return false
        }

        if(id === curIdChat.current.id) {
            socket.emit('readChat', {
                id: id
            })
            var datachat = curChat.current
            dataVes.unread = 0
            var element = document.getElementById('chat-history')
            if(datachat.pesan[datachat.pesan.length-1] !== data.pesan) {
                datachat.pesan?.push(data.pesan)
            }
            if(Object.values(datachat).length !== 0) {
                setChat(datachat)
                curChat.current = datachat
                if(Math.abs(element?.scrollHeight - element?.clientHeight - element?.scrollTop) < 1000) {
                    setTimeout(() => {
                        document.getElementById(`messages${chat.pesan.length}`).scrollIntoView()
                    }, 400);
                }
            }
            setLoadingMessage(false)
        } else {
            if(!dataVes.pesan.fromMe) {
                dataVes.unread = data.unread + 1
            } else {
                dataVes.unread = 0
            }
        }

        var index = dmessage.findIndex(isExist)
        if(index < curPin.current && index > -1) {
            dmessage.splice(index, 0, dataVes)
            dmessage.splice(index+1, 1)
        } else if(index === -1) {
            dmessage.splice(curPin.current, 0, dataVes)
        } else if(index > curPin.current-1) {
            dmessage.splice(curPin.current, 0, dataVes)
            dmessage.splice(index+1, 1)
        }
        setMessage(dmessage)
    }

    //buat sidebar
    const deletingChat = (id, data) => {
        if(id) {
            var dataVes = data
            var dmessage = message
            const isExist = (k) => {
                if(k.id._serialized === id) {
                    return true
                }
                return false
            }

            
            var index = dmessage.findIndex(isExist)
            if(index > -1) {
                dmessage.splice(index, 1, dataVes)
            }

            setMessage(dmessage)
        }
    }

    const handleDeleteMessage = (id, type, fromMe) => {
        let oSwal
        if(type === 'revoked' || !fromMe) {
            oSwal = {
                title: 'Hapus pesan',
                showCancelButton: true,
                confirmButtonText: 'Hapus untuk saya',
                cancelButtonText: 'Tidak',
                icon: 'question',
                text: 'Pesan yang sudah dihapus tidak dapat dikembalikan'
            }
        } else {
            oSwal = {
                title: 'Hapus pesan',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'Hapus untuk saya',
                denyButtonText: 'Hapus untuk semua',
                cancelButtonText: 'Tidak',
                icon: 'question',
                text: 'Pesan yang sudah dihapus tidak dapat dikembalikan'
            }
        }
        MySwal.fire(oSwal).then((res) => {
            if(res.isConfirmed) {
                if(idChat.id !== '') {
                    socket.emit('deleteMessage', {
                        chatId: idChat.id,
                        messageId: id,
                        page: offsetMessage+1,
                        everyone: false
                    })
                }
            } else if(res.isDenied) {
                if(idChat.id !== '') {
                    socket.emit('deleteMessage', {
                        chatId: idChat.id,
                        messageId: id,
                        page: offsetMessage,
                        everyone: true
                    })
                }
            }
        })
    }

    const downloadBase64 = (base64, filename) => {
        const linkSource = `${base64}`;
        const downloadLink = document.createElement("a");
        const fileName = filename;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    useEffect(() => {
        var reply = document.getElementById('reply-content')
        var chat = document.getElementById('chat-content')
        var element = document.getElementById('chat-history')
        console.log(selectedDocument)
        if(element?.style) {
            if(replyMessage.content === '' && replyMessage.media === '' && selectedMedia === '' && selectedDocument === '') {
                element.style.height = '440px'
                chat.style.backgroundColor = ''
                reply.style.borderRight = ''
            } else if((replyMessage.content !== '' || replyMessage.media !== '') && selectedMedia === '' && selectedDocument === '') {
                element.style.height = '400px'
                chat.style.backgroundColor = ''
                reply.style.borderRight = ''
            } else if(replyMessage.content === '' && replyMessage.media === '' && (selectedMedia !== '' || selectedDocument !== '')) {
                element.style.height = '370px'
                element.style.border = 'none'
                chat.style.backgroundColor = '#e8f1f3'
                reply.style.borderRight = 'none'
            } else if((replyMessage.content !== '' || replyMessage.media !== '') && (selectedMedia !== '' || selectedDocument !== '')) {
                element.style.height = '350px'
                element.style.border = 'none'
                chat.style.backgroundColor = '#e8f1f3'
                reply.style.borderRight = 'none'
            }
        }
    }, [heightStatus])

    useEffect(() => {
        if(message.length < 20) {
            getMessage()
        }
    }, [message])

    useEffect(() => {
        if(message?.length > 0) {
            socket.on('sendNewMessage', (data) => {
                if(message.length > 0) {
                    socket.emit('getUnreadNotif', {})
                    setNewMessage(data.data)
                    getNewMessage(data.data.id['_serialized'], data.data)
                }
            })
        }
    }, [message])

    useEffect(() => {
        var dataChat = message
        socket.on('sendNextMessage',(data) => {
            setLoadingChatNext(false)
                if(dataChat.length < (offsetChat+1)*20) {
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];
                        dataChat.push(element)
                    }
                    setMessage(dataChat)
                }
        })
    }, [offsetChat, chatScroll])

    useEffect(() => {
        var lanjut = true
        var datamessage = chat
        var length = chat?.pesan?.length
        socket.on('sendNextDetail', (data) => {
            if(lanjut) {
                setLoadingNextMessage(false)
                if(!data.next) {
                    setMoreMessage(false)
                } else {
                    if(length < (offsetMessage+1)*50) {
                        for (let index = 0; index < data?.data?.pesan?.length; index++) {
                            const element = data?.data?.pesan[index];
                            datamessage?.pesan?.unshift(element)
                        }
                        setChat(datamessage)
                        curChat.current = datamessage
                    }
                    setTimeout(() => {
                        var elementz = document.getElementById('messages51')
                        elementz?.scrollIntoView()
                        lanjut = false
                    }, 200);
                }
            }
        })
    }, [offsetMessage])

    useEffect(() => {
        let timer
        clearTimeout(timer)
        socket.on('sendDetailwOffset', (data) => {
            timer = setTimeout(() => {
                setOpen(true)
                setChat(data.data)
                curChat.current = data.data
                setLoadingMessage(false)
                document.getElementById('chat-history').scrollTo(0, 200000)
            }, 200);
        })
    }, [idChat])

    useEffect(() => {
        if(idChat.id !== '') {
            getDetailMessage()
        }
    }, [idChat])

    useEffect(() => {
        getChat()
    }, [chat])

    useEffect(() => {
        getSidebar()
    }, [message])

    useEffect(() => {
        socket.on('messageDeleted', (data) => {
            socket.emit('getMessageByOffset', {
                id: curIdChat.current.id,
                page: offsetMessage
            })
            deletingChat(data?.id?._serialized, data?.data)
        })
    }, [message])

    const format_text = (text) => {
        return text?.replace(/\n/g, '<br>').replace(/(?:\*)(?:(?!\s))((?:(?!\*|<br>).)+)(?:\*)/g,'<b>$1</b>')
           .replace(/(?:_)(?:(?!\s))((?:(?!<br>|_).)+)(?:_)/g,'<i>$1</i>')
           .replace(/(?:~)(?:(?!\s))((?:(?!<br>|~).)+)(?:~)/g,'<s>$1</s>')
           .replace(/(?:```)(?:(?!\s))((?:(?!<br>|```).)+)(?:```)/g,'<tt>$1</tt>')
    }
    
    const getChat = () => {
        const chatmessage = open ?
                            chat?.pesan?.map((msg, index) => {
                                var msgs = msg?.type === 'revoked' ? 
                                                '<p class="mb-0 text-secondary"><i class="fa-solid fa-ban"></i> Pesan ini telah dihapus</p>' 
                                                :
                                                linkifyHtml(format_text(msg?.body), {target: '_blank', className: 'text-underline'})
                                var replymsg =  msg?.reply?.body?.length > 25 ? 
                                                    msg?.reply?.body?.substring(0, 25)+'...' 
                                                    : 
                                                    msg?.reply?.body
                                replymsg =  msg?.reply?.type === 'document' ? 
                                                <p className="p-0 pb-3 m-0 text-secondary"><i className="fa-solid fa-file pr-1"></i> {replymsg}</p>
                                                : 
                                                replymsg
                                return(
                                    <li id={`messages${index+1}`} className="clearfix optionswrap" key={`chatmessage${index}`}>
                                        <div className={msg?.fromMe ? "message-data text-right" : "message-data"}>
                                            <span className="message-data-time">{msg?.time}</span>
                                        </div>
                                        <div className={msg?.fromMe ? 
                                                            // if from me (1)
                                                            msg?.type === 'sticker' && !msg?.hasReply ?
                                                                // if sticker and no reply (2)
                                                                "other-message float-right text-left p-0" 
                                                                : msg?.type === 'document' && !msg?.hasReply && msg?.body === msg?.filename? 
                                                                // else if document and no reply and body === filename (2)
                                                                'message other-message float-right text-left p-0 pb-2'
                                                                :
                                                                // else (2)
                                                                'message other-message float-right text-left p-0' 
                                                            :
                                                            // else (1)
                                                            msg?.type === 'sticker' && !msg?.hasReply ?
                                                                // if sticker and no reply (2)
                                                                "message p-0" 
                                                                : msg?.type === 'document' && !msg?.hasReply && msg?.body === msg?.filename?
                                                                // else if document and no reply and body === filename (2)
                                                                'message my-message p-0 pb-2'
                                                                :
                                                                // else (2)
                                                                'message my-message p-0'}>
                                            {msg.hasReply ?
                                                <div className={msg?.fromMe ? "myreplymessage overflow-hidden p-2 m-2" : "replymessage p-2 m-2"}>
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <div className="reply-name text-primary">
                                                                {msg?.reply?.fromMe ? 'Anda' : msg?.reply?.name}
                                                            </div>
                                                            <div className="reply-message">
                                                                {msg?.reply?.hasMedia && msg?.reply?.body === '' ? 
                                                                    msg?.reply?.type === 'image' ? 
                                                                        <p className="p-0 m-0 text-secondary"><i className="fa-solid fa-image"></i> Foto</p> 
                                                                    : msg?.reply.type === 'document' ?
                                                                        <p className="p-0 m-0 text-secondary"><i className="fa-solid fa-file"></i> Document</p> 
                                                                    : 
                                                                    <p className="p-0 m-0 text-secondary"><i className="fa-solid fa-note-sticky"></i> Stiker</p> 
                                                                : 
                                                                replymsg}
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0">
                                                            {msg?.reply?.hasMedia && msg?.type === 'image' ? <img className='message-reply-media' src={msg?.reply?.media} /> : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            : ''}
                                            {msg?.type === 'document' ?
                                                <div className="document-content p-2 m-2">
                                                    <div className="row ml-2">
                                                        <div className="col-1 my-auto h5">
                                                            <i className="fa-solid fa-file mr-2"></i> 
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    {msg?.filename.length > 25 ? msg?.filename.substring(0, 25)+'...' : msg?.filename} 
                                                                </div>
                                                                <div className="col-12 document-sub text-secondary">
                                                                    {msg?.filesize} • {msg?.filename?.toUpperCase().split('.')[1]}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-3 my-auto text-center">
                                                            <div className="document-download" onClick={() => {downloadBase64(msg?.media, msg?.filename)}}>
                                                                <i className="fa-solid fa-arrow-down"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''}
                                            {msg?.hasMedia && msg?.type === 'image' ? <img className='message-media p-2 m-2 mx-auto' src={msg?.media} alt="" /> : msg?.hasMedia && msg?.type === 'sticker' ? <img className={msg?.hasReply ? 'message-media mt-4 media-sticker' : 'message-media media-sticker'} src={msg?.media} alt="" /> : ''}
                                            {msg?.body === '' && msg?.type !== 'revoked' ? '' : <div className='p-2 m-2 text-left' dangerouslySetInnerHTML={{ __html: msgs }}></div>}
                                        </div>
                                        <i className={msg?.fromMe ? "fa-solid fa-ellipsis-vertical myoptions float-right px-3" : "fa-solid fa-ellipsis-vertical options px-3 py-1"} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                        <div className="dropdown-menu m-0 p-0" aria-labelledby="dropdownMenuButton">
                                            {msg?.type !== 'revoked' ? <p className="dropdown-item m-0 py-2" onClick={() => {setReplyMessage({content: msgs, id: msg?.id?.id, hasMedia: msg?.hasMedia, media: msg?.media, fromMe: msg?.fromMe, type: msg?.type}); setHeightStatus(!heightStatus)}}>Balas</p> : ''}
                                            <p className="dropdown-item m-0 py-2" onClick={() => {handleDeleteMessage(msg?.id?.id, msg?.type, msg?.fromMe)}}>Hapus</p>
                                        </div>
                                    </li>
                                )
                            })
                            :
                            ''
        return chatmessage
    }

    const getSidebar = () => {
        const sidebar = loadingChat ?
                    (
                        <SkeletonChat jumlah={20}/>
                    )
                    :
                    message?.map((msg, index) => {
                        var replace = format_text(msg?.pesan?.message?.replace(/\n/g, ' '))
                        var a = msg?.pesan?.type === 'revoked' ? 
                                    '<p class="mb-0"><i class="fa-solid fa-ban"></i> Pesan ini telah dihapus</p>' 
                                    : msg?.pesan?.type === 'image' && msg?.pesan?.message === '' ? 
                                        '<p class="p-0 m-0"><i class="fa-solid fa-image"></i> Foto</p>' 
                                    : msg?.pesan?.type === 'sticker' ? 
                                        '<p class="p-0 m-0"><i class="fa-solid fa-note-sticky"></i> Stiker</p>' 
                                    : msg?.pesan?.type === 'document' && msg?.pesan?.message === '' ? 
                                        '<p class="p-0 m-0"><i class="fa-solid fa-file"></i> Document</p>' 
                                    : msg.pesan?.message?.length > 20 ?
                                        msg?.pesan?.type === 'image' ?
                                            `<p class="p-0 m-0"><i class="fa-solid fa-image"></i> ${replace.slice(0, 20)+'...'}</p>`
                                            : msg?.pesan?.type === 'document' ?
                                            `<p class="p-0 m-0"><i class="fa-solid fa-file"></i> ${replace.slice(0, 20)+'...'}</p>`
                                            : 
                                            replace.slice(0, 20)+'...' 
                                    : 
                                    msg?.pesan?.type === 'image' ?
                                        `<p class="p-0 m-0"><i class="fa-solid fa-image"></i> ${replace}</p>`
                                        : msg?.pesan?.type === 'document' ?
                                        `<p class="p-0 m-0"><i class="fa-solid fa-file"></i> ${replace}</p>`
                                        : 
                                        replace
                        return(
                            <li onClick={() => {setIdChat({id: msg?.id['_serialized'], index: index}); handleRemoveNotif(index); curIdChat.current.id = msg?.id['_serialized']; curIdChat.current.index = index; setOpen(false); setLoadingMessage(true); setReplyMessage({content: '', id: '', media: '', hasMedia: false}); setSelectedDocument(''); setSelectedMedia('')}} className={idChat.id === msg?.id['_serialized'] ? 'clearfix active' : 'clearfix'} key={`chat${index}`}>
                                <img src={msg?.profile ? msg?.profile : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="avatar"/>
                                <div className="about">
                                    <div className="name pb-2">{msg?.nama?.length > 15 ? msg?.nama.slice(0, 15)+'...' : msg?.nama}</div>
                                    <div className="status" dangerouslySetInnerHTML={{ __html: a }}></div>
                                </div>
                                {msg.unread > 0 ?
                                    <div className="ur float-right">
                                        <p className="text-center">
                                        {msg?.unread}
                                        </p>
                                    </div>
                                    :
                                    ''
                                }
                            </li>
                        )
                    })
        return sidebar
    }

    const handleRemoveNotif = (index) => {
        var messagedata = message
        messagedata[index].unread = 0
        setMessage(messagedata)
        socket.emit('getUnreadNotif', {})
    }

    return (
        <section className="content-wrapper">
            <div className='container-fluid'>
                <div className="row clearfix">
                    <div className="col-lg-12 p-0">
                        <div className="card chat-app">
                            <div onScroll={scrolling} id="plist" className="people-list">
                                <ul className="list-unstyled chat-list mb-0">
                                    {getSidebar()}
                                    {loadingChatNext ? <SkeletonChat jumlah={20}/> : ''}
                                </ul>
                            </div>
                            <div className="chat" id='chat-content'>
                                <RingLoader
                                    color={'#0000FF'}
                                    loading={loadingMessage}
                                    size={50}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                    cssOverride={{
                                        position: 'relative',
                                        top: '40%',
                                        left: '50%'
                                    }}
                                />
                                {
                                    open ? 
                                    (
                                        <Fragment>
                                            <div className="chat-header clearfix">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <a data-toggle="modal" data-target="#view_info">
                                                            <img src={chat.profile ? chat.profile : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="avatar"/>
                                                        </a>
                                                        <div className="chat-about">
                                                            <h6 className="m-b-0">{chat.nama}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="chat-wrapper">
                                                <div className="chat-history" id='chat-history' onScroll={scrollDetail}>
                                                    {selectedMedia === '' && selectedDocument === '' ? 
                                                        <ul className="m-b-0">
                                                            {getChat()}
                                                        </ul>
                                                        : selectedMedia !== '' && selectedDocument === '' ?
                                                        <div className="selected-media">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="select-media-cancel-wrapper" onClick={() => {setHeightStatus(!heightStatus); setSelectedMedia(''); setTimeout(() => {document.getElementById(`messages${chat.pesan.length}`).scrollIntoView()}, 400); document.getElementById('messagemedia').value = null}}>
                                                                        <div className="select-media-cancel-button">
                                                                            X
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 text-center">
                                                                    <img className='selected-media-img' src={selectedMedia} alt="" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="selected-media h-100">
                                                            <div className="row h-100 my-auto">
                                                                <div className="col-12">
                                                                    <div className="select-media-cancel-wrapper" onClick={() => {setHeightStatus(!heightStatus); setSelectedDocument(''); setTimeout(() => {document.getElementById(`messages${chat.pesan.length}`).scrollIntoView()}, 400); document.getElementById('messagedocument').value = null}}>
                                                                        <div className="select-media-cancel-button">
                                                                            X
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 text-center">
                                                                    <h1>
                                                                        <i className='fa-solid fa-file'></i>
                                                                    </h1>
                                                                    <p>{selectedDocument}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="w-100">
                                                    <form onSubmit={handleSubmitMessage}>
                                                        <div className={replyMessage.content !== '' || replyMessage.hasMedia ? "chat-message clearfix py-0" : "chat-message clearfix"}>
                                                            <div id='reply-content' className={replyMessage.content !== '' || replyMessage.hasMedia ? 'reply-content pl-2' : 'reply-content reply-closed d-none'}>
                                                                <div className="row">
                                                                    <div className="col-9 py-1">
                                                                        <p className='p-0 m-0 text-primary'>{replyMessage.fromMe ? 'Anda' : chat.nama}</p>
                                                                        {replyMessage.content === '' ?
                                                                            replyMessage.type === 'image' ? 
                                                                                <p className="p-0 m-0 text-secondary"><i className="fa-solid fa-image"></i> Foto</p>
                                                                            : replyMessage.type === 'document' ?
                                                                                <p className="p-0 m-0 text-secondary"><i className="fa-solid fa-file"></i> Document</p>
                                                                            :
                                                                                <p className="p-0 m-0 text-secondary"><i className="fa-solid fa-sticker"></i> Sticker</p>
                                                                        :   replyMessage.content.length > 100 ?
                                                                                replyMessage.type === 'document' ?
                                                                                    <p className="p-0 m-0 text-secondary"><i className="fa-solid fa-file"></i> {replyMessage.content.substring(0, 100)+'...'}</p>
                                                                                : 
                                                                                    replyMessage.content.substring(0, 100)+'...' 
                                                                        :   replyMessage.type === 'document' ?
                                                                                <p className="p-0 m-0 text-secondary"><i className="fa-solid fa-file"></i> {replyMessage.content}</p>
                                                                                    :
                                                                                replyMessage.content}
                                                                    </div>
                                                                    <div className="col-3 text-right reply-cancel p-0">
                                                                        <div className="mr-2 position-relative">
                                                                            <img className='reply-content-media' src={replyMessage.media} alt="" />
                                                                            <div onClick={() => {setReplyMessage({content: '', id: '', media: '', hasMedia: false, type: ''}); setHeightStatus(!heightStatus)}} className={replyMessage.content === '' && replyMessage.media === '' ? 'position-absolute reply-cancel-button d-none' : 'position-absolute reply-cancel-button'}>
                                                                                <div className="reply-cancel-button-wrapper">
                                                                                    <div className="reply-cancel-button-button">
                                                                                        x
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="input-group mb-0">
                                                                <input onChange={handleDocumentSelect} className='d-none' type="file" id='messagedocument' />
                                                                <input onChange={handleMediaSelect} className='d-none' type="file" id='messagemedia' />
                                                                <input type="text" id='message' className="form-control" placeholder="Enter text here..."/>
                                                                <div className="input-group-prepend">
                                                                <Popover 
                                                                anchorOrigin={{
                                                                    vertical: -20,
                                                                    horizontal: 100,
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'center',
                                                                }}
                                                                open={popMedia}
                                                                onClose={() => {setPopMedia(false); setAnchorEl(null)}}
                                                                anchorEl={anchorEl}
                                                                >
                                                                    {/* Disini Buat Bottom Sheetnya */}
                                                                    <div className="row p-4">
                                                                        <div className="col-md-4">
                                                                            <div className="px-2">
                                                                                <button onClick={() => {document.getElementById('messagedocument').click()}} type='button' className={selectedMedia === '' ? "input-group-text" : "input-group-text d-none"}><i className="fa-solid fa-file"></i></button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="px-2">
                                                                                <button onClick={() => {document.getElementById('messagemedia').click()}} type='button' className={selectedMedia === '' ? "input-group-text" : "input-group-text d-none"}><i className="fa-solid fa-image"></i></button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="px-2">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Popover>
                                                                    <button type='button' onClick={(e) => {setPopMedia(true); setAnchorEl(e.target)}} className={selectedMedia === '' && selectedDocument === '' ? "input-group-text" : "input-group-text d-none"}><i className="fa-solid fa-paperclip"></i></button>
                                                                    <button type='submit' className="input-group-text"><i className="fa-solid fa-paper-plane"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                    :
                                    ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
