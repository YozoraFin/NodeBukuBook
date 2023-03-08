import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import AksesToken from "./AksesTokenModel.js";
import Buku from "./BukuModel.js";
import Cart from "./CartModel.js";
import Komentar from "./KomentarModel.js";
import Order from "./OrderModel.js";

const {DataTypes} = Sequelize
const Customer = db.define('bukubook_content_customer', {
    NamaPanggilan: {
        type: DataTypes.STRING
    },
    NamaLengkap: {
        type: DataTypes.STRING
    },
    Email: {
        type: DataTypes.STRING
    },
    NoTelp: {
        type: DataTypes.STRING
    },
    Alamat: {
        type: DataTypes.TEXT
    },
    Password: {
        type: DataTypes.STRING
    },
    Profil: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

Customer.hasMany(AksesToken, {
    foreignKey: 'CustomerID',
    as: 'Token'
})
AksesToken.belongsTo(Customer, {
    foreignKey: 'CustomerID',
    as: 'Customer'
})
Customer.hasMany(Cart, {
    as: 'Cart',
    foreignKey: 'CustomerID'
})
Cart.belongsTo(Customer, {
    as: 'Customer'
})
Customer.hasMany(Komentar, {
    as: 'Komentar',
    foreignKey: 'CustomerID'
})
Komentar.belongsTo(Customer, {
    as: 'Customer'
})
Customer.hasMany(Order, {
    foreignKey: 'CustomerID',
    as: 'Order'
})
Order.belongsTo(Customer, {
    as: 'Customer'
})

export default Customer