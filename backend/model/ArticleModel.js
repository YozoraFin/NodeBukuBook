import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Kategori from "./KategoriModel.js";
import Komentar from "./KomentarModel.js";

const {DataTypes} = Sequelize
const Article = db.define('bukubook_content_articlepage', {
    Judul: {
        type: DataTypes.STRING
    },
    Isi: {
        type: DataTypes.TEXT
    },
    Penulis: {
        type: DataTypes.STRING
    },
    Teaser: {
        type: DataTypes.TEXT
    },
    KategoriID: {
        type: DataTypes.INTEGER
    },
    SrcGambar: {
        type: DataTypes.TEXT
    },
    NamaGambar: {
        type: DataTypes.TEXT
    },
    Tanggal: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

Kategori.hasMany(Article, {
    foreignKey: 'KategoriID',
    as: 'Artikel'
})
Article.belongsTo(Kategori, {
    foreignKey: 'KategoriID',
    as: 'Kategori'
})
Article.hasMany(Komentar, {
    foreignKey: 'ArticleID',
    as: 'Komentar'
})
Komentar.belongsTo(Article, {
    as: 'Artikel'
})

export default Article