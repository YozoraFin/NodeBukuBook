import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize

const KuponPribadi = db.define('kupon_pribadi', {
    CustomerID: {
        type: DataTypes.INTEGER
    },
    KuponID: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default KuponPribadi