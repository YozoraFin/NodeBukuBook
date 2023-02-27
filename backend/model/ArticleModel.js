import { Sequelize } from "sequelize";
import db from "../config/Database.js";

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
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Article