import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize
const Kategori = db.define('bukubook_content_kategori', {
    Kategori: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Kategori