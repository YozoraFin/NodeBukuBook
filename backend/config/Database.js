import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const password = process.env.DB_PASSWORD
const Op = Sequelize.Op;
const db = new Sequelize('bukubook2', 'usersiswa', password, {
    host: 'localhost',
    dialect: 'mysql',
});

export default db