import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import KuponPribadi from "./KuponPribadiModel.js";
import Customer from "./CustomerModel.js";

const {DataTypes} = Sequelize
const Kupon = db.define('kupon', {
    Judul: {
        type: DataTypes.STRING
    },
    Deskripsi: {
        type: DataTypes.TEXT
    },
    Kode: {
        type: DataTypes.STRING
    },
    Tipe: {
        type: DataTypes.BOOLEAN
    },
    Potongan: {
        type: DataTypes.INTEGER
    },
    Teaser: {
        type: DataTypes.STRING
    },
    SrcGambar: {
        type: DataTypes.TEXT
    },
    NamaGambar: {
        type: DataTypes.STRING
    },
    HighLight: {
        type: DataTypes.BOOLEAN
    },
    Mulai: {
        type: DataTypes.BIGINT
    },
    Selesai: {
        type: DataTypes.BIGINT
    },
    Akses: {
        type: DataTypes.BOOLEAN
    },
    Minimal: {
        type: DataTypes.INTEGER
    },
    BatasPakai: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
})


export default Kupon