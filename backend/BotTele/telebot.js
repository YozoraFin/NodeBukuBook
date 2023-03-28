import { Telegraf, Scenes, session, Markup } from "telegraf";
import { message } from 'telegraf/filters';
import dotenv from 'dotenv'
import Buku from "../model/BukuModel.js";
import Genre from "../model/GenreModel.js";
import Sampul from "../model/SampulModel.js";
import { Op, Sequelize } from "sequelize";
import Article from "../model/ArticleModel.js";
import Kategori from "../model/KategoriModel.js";
import Komentar from "../model/KomentarModel.js";
import Customer from "../model/CustomerModel.js";
import fs from "fs";
import md5 from "md5";
import AksesToken from "../model/AksesTokenModel.js";
dotenv.config()
const separator = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
let user = fs.readFileSync('./BotTele/user.json', 'utf8')
let oUser = JSON.parse(user)

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(async (ctx, next) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  await next()
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

const defaultKeyboardGuest = Markup.keyboard([
    ['Cari', 'Login']
])

const defaultKeyboardUser = Markup.keyboard([
    ['Cari', 'Logout'],
    ['Riwayat pesanan']
])

const searchUserByToken = async(ctx) => {
    const user = await Customer.findOne({
        include: [
            {
                model: AksesToken,
                as: 'Token',
                where: {
                    AksesToken: oUser[ctx.chat.id].AksesToken
                }
            }
        ]
    })
    return user
}

// Ini scene buat ngarahin user login
const loginSceneWizard = new Scenes.WizardScene('login',
    async (ctx) => {
        if(oUser[ctx.chat.id] && oUser[ctx.chat.id].Login && oUser[ctx.chat.id].Kadaluarsa > Date.now()) {
            const user = await searchUserByToken(ctx)
            await ctx.reply(`Anda telah login sebagai ${user.NamaLengkap}`, Markup.removeKeyboard())
            await ctx.reply('Apakah anda tetap ingin melanjutkan?')
            await ctx.reply('Tekan /kembali jika ingin membatalkan')
        } else {
            await ctx.reply('Selamat datang di sesi login!', Markup.removeKeyboard())
            await ctx.reply('Jika anda belum mempunyai akun harap buat akun terlebih dahulu pada halaman http://127.0.0.1:3000/register', Markup.inlineKeyboard([[{text: 'Buat Akun', url: 'http://127.0.0.1:3000/register'}]]))
        }
        await ctx.reply('Masukkan alamat email anda:')
        return ctx.wizard.next()
    },
    async (ctx) => {
        if(ctx.message.text === '/kembali') {
            let keyboard
            if(oUser[ctx.chat.id] && oUser[ctx.chat.id].Login && oUser[ctx.chat.id].Kadaluarsa > Date.now()) {
                keyboard = defaultKeyboardUser
            } else {
                keyboard = defaultKeyboardGuest
            }
            ctx.reply('Login dibatalkan', keyboard)
            return ctx.scene.leave()
        }
        const user = await Customer.findOne({
            where: {
                Email: ctx.message.text
            }
        })
        if(user) {
            ctx.wizard.state.user = user
            ctx.reply('Masukkan kata sandi anda')
            return ctx.wizard.next()
        } else {
            ctx.reply(`Akun dengan email ${ctx.message.text} tidak ditemukan. Tekan /kembali jika ingin membatalkan`)
        }
    },
    async(ctx) => {
        let pass = ctx.message.text
        ctx.deleteMessage()
        if(md5(pass) === ctx.wizard.state.user.Password) {
            ctx.reply('Login berhasil', defaultKeyboardUser)
            let token = md5(`${ctx.wizard.state.user.id}${Date.now()}`)
            oUser[`${ctx.chat.id}`] = {
                Login: true,
                AksesToken: token,
                Kadaluarsa: Date.now()+24*60*60*1000
            }
            const object = {
                AksesToken: token,
                CustomerID: ctx.wizard.state.user.id,
                Kadaluarsaa: Date.now()+24*60*60*1000
            }
            await AksesToken.create(object)
            fs.writeFileSync('./BotTele/user.json', JSON.stringify(oUser))
            
            return ctx.scene.leave()
        } else if(pass !== '/kembali') {
            ctx.reply('Password yang dimasukkan salah.\nTekan /kembali jika ingin merubah alamat email')
        }

        if(pass === '/kembali') {
            ctx.reply('Masukkan alamat email anda:')
            return ctx.wizard.back()
        }
    }
)

// Ini scene buat mencari Buku atau Artikel
const cariSceneWizard = new Scenes.WizardScene('cari',
    (ctx) => {
        let infoMessage = `Silahkan pilih apa yang ingin anda cari`;
        bot.telegram.sendMessage(ctx.chat.id, infoMessage, Markup.keyboard([['Buku', 'Artikel']]).oneTime())
        return ctx.wizard.next()
    },
    (ctx) => {
        if(ctx.message.text.toLowerCase() === 'buku' || ctx.message.text.toLowerCase() === 'artikel') {
            ctx.reply(`Masukkan kata kunci ${ctx.message.text.toLowerCase()} yang ingin dicari`, Markup.removeKeyboard())
            ctx.wizard.state.cari = ctx.message.text.toLowerCase()
            return ctx.wizard.next()
        } else {
            ctx.reply('Tolong masukkan pilihan yang valid', Markup.keyboard([['Kembali']]).oneTime())
            return ctx.wizard.back()
        }
    },
    async(ctx) => {
        let keyboard
        if(oUser[ctx.chat.id] && oUser[ctx.chat.id].Login && oUser[ctx.chat.id].Kadaluarsa > Date.now()) {
            keyboard = defaultKeyboardUser
        } else {
            keyboard = defaultKeyboardGuest
        }

        ctx.reply(`Sedang mencari ${ctx.wizard.state.cari} dengan kata kunci ${ctx.message.text}`, keyboard)

        if(ctx.wizard.state.cari === 'buku') {
            const buku = await Buku.findAll({
                attributes: ['ID', 'Judul', 'Sinopsis', 'Penulis', 'Harga', 'Stok', 'Genreid', 'genrehid'],
                include: [
                    {
                        model: Sampul,
                        attributes: ['id', 'SrcGambar', 'NamaGambar'],
                        as: 'Sampul'
                    },
                    {
                        model: Genre,
                        as: 'Genre'
                    }
                ],
                order: [
                    ['ID', 'DESC']
                ],
                where: {
                    Judul: {
                        [Op.substring]: ctx.message.text
                    }
                }
            })

            if(buku.length < 1) {
                ctx.reply(`Gagal menemukan buku dengan kata kunci ${ctx.message.text}`)
                return ctx.scene.leave()
            }
    
            for (let index = 0; index < buku.length; index++) {
                const element = buku[index];
                const caption = `${element.Judul}\n\nPenulis: ${element.Penulis}\nHarga: Rp ${separator(element.Harga)}\nGenre: ${element.Genre.Genre}`
                await ctx.replyWithPhoto(
                    {
                        source: element.Sampul[0].SrcGambar.replace('http://127.0.0.1:5000', '.')
                    },
                    {
                        caption: caption,
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Order Sekarang!', 
                                        url: `http://127.0.0.1:3000/buku/${element.id}`
                                    }
                                ]
                            ]
                        },
                    }, 
                )
            }
        } else {
            const artikel = await Article.findAll({
                attributes: ['id', 'Judul', 'Isi', 'Penulis', 'Teaser', 'KategoriID', 'SrcGambar', 'NamaGambar', 'Tanggal', [Sequelize.fn('Count', Sequelize.col('Komentar.Komentar')), 'JumlahKomen']],
                where: {
                    [Op.or]: [
                        {
                            Penulis: {
                                [Op.substring]: ctx.message.text
                            }
                        },
                        {
                            Judul: {
                                [Op.substring]: ctx.message.text
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: Kategori,
                        as: 'Kategori'
                    },
                    {
                        model: Komentar,
                        as: 'Komentar',
                        attributes: []
                    }
                ],
                order: [
                    ['id', 'DESC']
                ],
                group: ['bukubook_content_articlepage.Judul']
            })

            if(artikel.length < 1) {
                ctx.reply(`Gagal menemukan artikel dengan kata kunci ${ctx.message.text}`)
                return ctx.scene.leave()
            }

            for (let index = 0; index < artikel.length; index++) {
                const element = artikel[index];
                const caption = `${element.Tanggal}\n\n${element.Judul}\n\nPenulis: ${element.Penulis}\nKatgeori: ${element.Kategori.Kategori}\n\n${element.Teaser}`
                await ctx.replyWithPhoto(
                    {
                        source: element.SrcGambar.replace('http://127.0.0.1:5000', '.')
                    },
                    {
                        caption: caption,
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Baca Sekarang', 
                                        url: `http://127.0.0.1:3000/blog/${element.id}`
                                    }
                                ]
                            ]
                        },
                    },
                )
            }
        }
        return ctx.scene.leave()
    }
)

const stage = new Scenes.Stage([cariSceneWizard, loginSceneWizard])

bot.use(session());
bot.use(stage.middleware());

bot.start(async(ctx) => {
    let keyboard
    if(oUser[ctx.chat.id] && oUser[ctx.chat.id].Login && oUser[ctx.chat.id].Kadaluarsa > Date.now()) {
        keyboard = defaultKeyboardUser
    } else {
        keyboard = defaultKeyboardGuest
    }
    ctx.reply(
        'Apa yang ingin anda lakukan hari ini?',
        keyboard
    )
})

bot.on('message', ctx => {
    let cx = ctx.message.text.toLowerCase()
    if(cx === 'login') {
        ctx.scene.enter('login')
    } else if(cx === 'cari') {
        ctx.scene.enter('cari')
    } else if(cx === 'riwayat pesanan') {

    } else if(cx === 'logout') {
        if(oUser[ctx.chat.id] && oUser[ctx.chat.id].Login && oUser[ctx.chat.id].Kadaluarsa > Date.now()) {
            oUser[ctx.chat.id].Kadaluarsa = 0
            oUser[ctx.chat.id].Login = false
            oUser[ctx.chat.id].AksesToken = ''
            fs.writeFileSync('./BotTele/user.json', JSON.stringify(oUser))
            ctx.reply('Berhasil melakukan logout', defaultKeyboardGuest)
        } else {
            ctx.reply('Anda belum login sama sekali')
        }
    } else {
        ctx.reply('Command yang diberikan tidak valid!')
    }
})

bot.action('logout', ctx => {
    oUser[ctx.chat.id].Kadaluarsa = 0
    oUser[ctx.chat.id].Login = false
    oUser[ctx.chat.id].AksesToken = ''
    fs.writeFileSync('./BotTele/user.json', JSON.stringify(oUser))
    ctx.reply('Berhasil melakukan logout', defaultKeyboardGuest)
})

export default bot