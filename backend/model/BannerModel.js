import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize
const Banner = db.define('bukubook_content_event', {
    Judul: {
        type: DataTypes.STRING
    },
    Deskripsi: {
        type: DataTypes.STRING
    },
    SrcBanner: {
        type: DataTypes.TEXT
    },
    NameBanner: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false,
})

export default Banner