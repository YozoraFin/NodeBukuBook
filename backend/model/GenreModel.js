import { Sequelize } from 'sequelize'
import db from '../config/Database.js'
import Buku from './BukuModel.js'

const {DataTypes} = Sequelize
const Genre = db.define('bukubook_content_genre', {
    Genre: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Genre