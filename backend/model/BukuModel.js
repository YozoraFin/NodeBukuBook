import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Genre from "./GenreModel.js";

const {DataTypes} = Sequelize
const Buku = db.define('buku', {
    Judul: {
        type: DataTypes.STRING
    },
    Sinopsis: {
        type: DataTypes.TEXT
    },
    Penulis: {
        type: DataTypes.STRING
    },
    Stok: {
        type: DataTypes.INTEGER
    },
    Harga: {
        type: DataTypes.INTEGER
    },
    Rekomended: {
        type: DataTypes.INTEGER
    },
    Genreid: {
        type: DataTypes.INTEGER,
    },
}, {
    freezeTableName: true,
    timestamps: false
})

Genre.hasMany(Buku, {
    foreignKey: 'genrehid',
    as: 'Buku'
});
Buku.belongsTo(Genre, {
    foreignKey: 'genrehid',
    as: 'Genre'
})

export default Buku