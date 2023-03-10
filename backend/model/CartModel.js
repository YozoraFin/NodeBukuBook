import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Customer from "./CustomerModel.js";

const {DataTypes} = Sequelize

const Cart = db.define('bukubook_content_cart', {
    qty: {
        type: DataTypes.INTEGER
    },
    CustomerID: {
        type: DataTypes.INTEGER
    },
    BukuID: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Cart