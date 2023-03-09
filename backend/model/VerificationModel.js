import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize

const Verification = db.define('verification', {
    NoTelp: {
        type: DataTypes.TEXT
    },
    Code: {
        type: DataTypes.INTEGER
    },
    Kadaluarsa: {
        type: DataTypes.BIGINT
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Verification