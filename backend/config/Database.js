import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const password = process.env.DB_PASSWORD
const db = new Sequelize('bukubook', 'usersiswa', password, {
    host: 'localhost',
    dialect: 'mysql'
});

export default db