import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Buku from "./BukuModel.js";

const {DataTypes} = Sequelize

const OrderDetail = db.define('bukubook_content_orderdetail', {
    Quantity: {
        type: DataTypes.INTEGER
    },
    Subtotal: {
        type: DataTypes.INTEGER
    },
    BukuID: {
        type: DataTypes.INTEGER
    },
    OrderID: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
})
Buku.hasMany(OrderDetail, {
    as: 'OrderDetail',
    foreignKey: 'BukuID'
})
OrderDetail.belongsTo(Buku, {
    as: 'Buku'
})

export default OrderDetail