import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()

export const getProvince = async(req, res) => {
    try {
        const config = {
            headers: {
                key: process.env.API_KEY_RAJAONGKIR
            }
        }
        let data = []
        axios.get('https://api.rajaongkir.com/starter/province', config).then((response) => {
            response.data.rajaongkir.results.forEach(element => {
                data.push({
                    id: element.province_id,
                    provinsi: element.province
                })
            });
            res.json({
                status: 200,
                data: data,
                message: 'Ok'
            })
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCity = async(req, res) => {
    try {
        const config = {
            headers: {
                key: process.env.API_KEY_RAJAONGKIR
            }
        }

        let data = []

        axios.get('https://api.rajaongkir.com/starter/city?province='+req.body.ProvinceID, config).then((response) => {
            response.data.rajaongkir.results.forEach(element => {
                data.push({
                    id: element.city_id,
                    kota: element.city_name
                })
            });
            res.json({
                status: 200,
                data: data,
                message: 'Ok'
            })
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const getOngkir = async(req, res) => {
    try {
        const config = {
            headers: {
                key: process.env.API_KEY_RAJAONGKIR
            }
        }

        const form = {
            origin: req.body.Asal,
            destination: req.body.Tujuan,
            weight: req.body.Berat,
            courier: req.body.Kurir
        }

        let data = []

        axios.post('https://api.rajaongkir.com/starter/cost', form, config).then((response) => {
            response.data.rajaongkir.results[0].costs.forEach(element => {
                data.push({
                    service: element.service,
                    deskripsi: element.description,
                    harga: element.cost[0].value,
                    estimasi: element.cost[0].etd
                })
            });
            res.json({
                status: 200,
                data: data,
                message: 'OK'
            })
        })
        
    } catch (error) {
        console.log(error)
    }
}