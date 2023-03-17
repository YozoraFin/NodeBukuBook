import React, { Fragment, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import SkeletonChat from './SkeletonChat.js'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

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
    const [loadingMessage, setLoadingMessage] = useState(true)
    const [loadingNextMessage, setLoadingNextMessage] = useState(false)
    const [offsetChat, setOffsetChat] = useState(0)
    const [offsetMessage, setOffsetMessage] = useState(0)
    const [moreMessage, setMoreMessage] = useState(true)
    const curIdChat = useRef({
        id: '',
        index: 0
    })
    const curChat = useRef({})
    const curPin = useRef(0)

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

    var scrolling = debounce(handleScrollChat, 500)

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
                var elementz = document.getElementById('messages50')
                elementz?.scrollIntoView()
            }, 1000);
            setLoadingMessage(false)
        })
    }

    const handleScrollDetail = () => {
        var scroll = Math.ceil(document.getElementById('chat-history')?.scrollTop)
        if(!loadingMessage && !loadingNextMessage && moreMessage) {
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

    var scrollDetail = debounce(handleScrollDetail, 500)

    const handleSubmitMessage = (e) => {
        e.preventDefault()
        socket.emit('sendingMessage', {
            id: idChat.id,
            message: document.getElementById('message')?.value
        })
        document.getElementById('message').value = ''
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
                        element.scrollTo(0, 200000)
                    }, 500);
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
        } else if(index > 1) {
            dmessage.splice(curPin.current, 0, dataVes)
            dmessage.splice(index+1, 1)
        }
        setMessage(dmessage)
    }

    const handleDeleteMessage = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Hapus pesan',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Hapus untuk saya',
            denyButtonText: 'Hapus untuk semua',
            cancelButtonText: 'Tidak',
            icon: 'question',
            text: 'Pesan yang sudah dihapus tidak dapat dikembalikan'
        }).then((res) => {
            if(res.isConfirmed) {
                if(idChat.id !== '') {
                    socket.emit('deleteMessage', {
                        chatId: idChat.id,
                        messageId: id,
                        page: offsetMessage+1,
                        everyone: false
                    })
                    setLoadingMessage(true)
                }
            } else if(res.isDenied) {
                if(idChat.id !== '') {
                    socket.emit('deleteMessage', {
                        chatId: idChat.id,
                        messageId: id,
                        page: offsetMessage+1,
                        everyone: true
                    })
                    setLoadingMessage(true)
                }
            }
            console.log('halo')
        })
    }

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
                    setLoadingMessage(true)
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
                    }, 500);
                }
            }
        })
    }, [offsetMessage])

    useEffect(() => {
        socket.on('sendDetailwOffset', (data) => {
            socket.emit('getUnreadNotif')
            setOpen(true)
            setChat(data.data)
            curChat.current = data.data
            setTimeout(() => {
                document.getElementById('chat-history')?.scrollTo(0, 200000)
            }, 500);
            setLoadingMessage(false)
        })
    }, [idChat])

    useEffect(() => {
        if(idChat.id !== '') {
            getDetailMessage()
        }
    }, [idChat])

    useEffect(() => {
        if(!loadingMessage) {
            var elementz = document.getElementById('messages50')
            elementz?.scrollIntoView()
        }
    }, [loadingMessage])

    useEffect(() => {
        getChat()
    }, [chat])

    useEffect(() => {
        socket.on('messageDeleted', () => {
            socket.emit('getMessageByOffset', {
                id: idChat.id,
                page: offsetMessage+1
            })
        })
    }, [idChat])

    const format_text = (text) => {
        return text.replace(/\n/g, '<br>').replace(/(?:\*)(?:(?!\s))((?:(?!\*|<br>).)+)(?:\*)/g,'<b>$1</b>')
           .replace(/(?:_)(?:(?!\s))((?:(?!<br>|_).)+)(?:_)/g,'<i>$1</i>')
           .replace(/(?:~)(?:(?!\s))((?:(?!<br>|~).)+)(?:~)/g,'<s>$1</s>')
           .replace(/(?:```)(?:(?!\s))((?:(?!<br>|```).)+)(?:```)/g,'<tt>$1</tt>')
    }
    
    const getChat = () => {
        const chatmessage = open ?
                            chat.pesan.map((msg, index) => {
                                var msgs = msg?.type === 'revoked' ? '<p class="mb-0 text-secondary"><i class="fa-solid fa-ban"></i> Pesan ini telah dihapus</p>' : format_text(msg?.body)
                                return(
                                    <li id={`messages${index+1}`} className="clearfix optionswrap" key={`chatmessage${index}`}>
                                        <div className={msg?.fromMe ? "message-data text-right" : "message-data"}>
                                            <span className="message-data-time">{msg?.time}</span>
                                        </div>
                                        <div className={msg?.fromMe ? "message other-message float-right" : "message my-message"} dangerouslySetInnerHTML={{ __html: msgs }}></div>
                                        <i className={msg?.fromMe ? "fa-solid fa-ellipsis-vertical myoptions float-right px-3" : "fa-solid fa-ellipsis-vertical options px-3 py-1"} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <p className="dropdown-item m-0" onClick={() => {}}>Balas</p>
                                            <p className="dropdown-item m-0" onClick={() => {handleDeleteMessage(msg?.id?.id)}}>Hapus</p>
                                        </div>
                                    </li>
                                )
                            })
                            :
                            ''
        return chatmessage
    }

    const handleRemoveNotif = (index) => {
        var messagedata = message
        messagedata[index].unread = 0
        setMessage(messagedata)
        socket.emit('getUnreadNotif', {})
    }

    const sidebar = loadingChat ?
                    (
                        <SkeletonChat jumlah={20}/>
                    )
                    :
                    message?.map((msg, index) => {
                        var replace = format_text(msg?.pesan?.message?.replace(/\n/g, ' '))
                        var a =  msg?.pesan?.type === 'revoked' ? '<p class="mb-0"><i class="fa-solid fa-ban"></i> Pesan ini telah dihapus</p>' : msg?.pesan?.type === 'image' ? '<p class="p-0 m-0"><i class="fa-solid fa-image"></i> Foto</p>' : msg?.pesan?.type === 'sticker' ? '<p class="p-0 m-0"><i class="fa-solid fa-note-sticky"></i> Stiker</p>' : msg.pesan?.message?.length > 20 ? replace.slice(0, 20)+'...' : replace
                        return(
                            <li onClick={() => {setIdChat({id: msg?.id['_serialized'], index: index}); document.getElementById('messages50')?.scrollIntoView(); handleRemoveNotif(index); curIdChat.current.id = msg?.id['_serialized']; curIdChat.current.index = index; setOpen(false); setLoadingMessage(true)}} className={idChat.id === msg?.id['_serialized'] ? 'clearfix active' : 'clearfix'} key={`chat${index}`}>
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

    return (
        <section className="content-wrapper">
            <div className='container-fluid'>
                <div className="row clearfix">
                    <div className="col-lg-12 p-0">
                        <div className="card chat-app">
                            <div onScroll={scrolling} id="plist" className="people-list">
                                <ul className="list-unstyled chat-list mb-0">
                                    {sidebar}
                                    {loadingChatNext ? <SkeletonChat jumlah={20}/> : ''}
                                </ul>
                            </div>
                            <div className="chat">
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
                                            <div className="chat-history" id='chat-history' onScroll={scrollDetail}>
                                                <ul className="m-b-0">
                                                    {getChat()}
                                                </ul>
                                            </div>
                                            <form onSubmit={handleSubmitMessage} >
                                                <div className="chat-message clearfix">
                                                    <div className="input-group mb-0">
                                                        <input required type="text" id='message' className="form-control" placeholder="Enter text here..."/>
                                                        <div className="input-group-prepend">
                                                            <button className="input-group-text"><i className="fa-solid fa-paper-plane"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
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
