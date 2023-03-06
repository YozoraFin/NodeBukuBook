import { Sequelize } from 'sequelize'
import db from '../config/Database.js'

const {DataTypes} = Sequelize
const Komentar = db.define('bukubook_content_komentar', {
    Komentar: {
        type: DataTypes.TEXT
    },
    ArticleID: {
        type: DataTypes.INTEGER
    },
    CustomerID: {
        type: DataTypes.INTEGER
    },
    Tanggal: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Komentar