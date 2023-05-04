import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import OrderDetail from "./OrderDetailModel.js";

const {DataTypes} = Sequelize
const Order = db.define('bukubook_content_order', {
    InvoiceNumber: {
        type: DataTypes.TEXT
    },
    Total: {
        type: DataTypes.INTEGER
    },
    CustomerID: {
        type: DataTypes.INTEGER
    },
    Alamat: {
        type: DataTypes.TEXT
    },
    NoTelp: {
        type: DataTypes.TEXT
    },
    Nama: {
        type: DataTypes.TEXT
    },
    Email: {
        type: DataTypes.TEXT
    },
    Catatan: {
        type: DataTypes.TEXT
    },
    Kodepos: {
        type: DataTypes.INTEGER
    },
    Provinsi: {
        type: DataTypes.TEXT
    },
    Kota: {
        type: DataTypes.TEXT
    },
    Kurir: {
        type: DataTypes.TEXT
    },
    Ongkir: {
        type: DataTypes.INTEGER
    },
    Subtotal: {
        type: DataTypes.INTEGER
    },
    Tanggal: {
        type: DataTypes.STRING
    },
    Potongan: {
        type: DataTypes.INTEGER
    },
    PPN: {
        type: DataTypes.INTEGER
    },
    Kupon: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
})

Order.hasMany(OrderDetail, {
    foreignKey: 'OrderID',
    as: 'Detail'
})
OrderDetail.belongsTo(Order, {
    as: 'Order'
})

export default Order