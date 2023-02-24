import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize

const Social = db.define('bukubook_content_social', {
    Nama: {
        type: DataTypes.STRING
    },
    Icon: {
        type: DataTypes.STRING
    },
    Link: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Social