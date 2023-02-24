import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize

const SiteConfig = db.define('siteconfig', {
    Tentang: {
        type: DataTypes.STRING
    },
    Alamat: {
        type: DataTypes.STRING
    },
    NoTELP: {
        type: DataTypes.STRING
    },
    Email: {
        type: DataTypes.STRING
    },
    Map: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default SiteConfig