import { Sequelize } from 'sequelize'
import db from '../config/Database.js'

const {DataTypes} = Sequelize

const Broadcast = db.define('broadcast', {
    Judul: {
        type: DataTypes.STRING
    },
    Konten: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Broadcast