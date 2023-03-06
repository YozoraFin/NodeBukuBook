import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize
const AksesToken = db.define('bukubook_content_accesstoken', {
    AksesToken: {
        type: DataTypes.STRING
    },
    CustomerID: {
        type: DataTypes.INTEGER
    },
    Kadaluarsaa: {
        type: DataTypes.BIGINT
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default AksesToken