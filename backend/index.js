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

const app = express()

try {
    await db.authenticate();
    console.log('Berhasil terhubung dengan database')
} catch(error) {
    console.log(error)
}

app.use(cors())
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

app.listen(5000, () => {console.log('lesgo')})