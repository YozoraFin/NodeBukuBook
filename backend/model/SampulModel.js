import { Sequelize } from 'sequelize'
import db from '../config/Database.js'
import Buku from './BukuModel.js'

const {DataTypes} = Sequelize
const Sampul = db.define('sampul_buku', {
    SrcGambar: {
        type: DataTypes.TEXT
    },
    NamaGambar: {
        type: DataTypes.TEXT
    },
    BukuID: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false,
})

Buku.hasMany(Sampul, {
    as: 'Sampul',
});
Sampul.belongsTo(Buku, {
    foreignKey: 'BukuID',
})

export default Sampul