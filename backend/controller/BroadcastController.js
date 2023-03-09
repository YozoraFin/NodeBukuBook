import client from "../client/client.js"
import Broadcast from "../model/BroadcastModel.js"
import Customer from "../model/CustomerModel.js"

export const getBroadcast = async(req, res) => {
    try {
        const broadcast = await Broadcast.findAll()
        res.json({
            status: 200,
            data: broadcast,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const getDetailBroadcast = async(req, res) => {
    try {
        const broadcast = await Broadcast.findOne({
            where: {
                id: req.params.id
            }
        })
        res.json({
            status: 200,
            data: broadcast,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const createBroadcast = async(req, res) => {
    try {
        await Broadcast.create(req.body)
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateBroadcast = async(req, res) => {
    try {
        await Broadcast.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteBroadcast = async(req, res) => {
    try {
        await Broadcast.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json({
            status: 200,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

export const sendBroadcast = async(req, res) => {
    try {
        const broadcast = await Broadcast.findOne({
            where: {
                id: req.body.id
            }
        })

        const customer = await Customer.findAll({
            attributes: ['NoTelp']
        })

        customer.forEach(element => {
            var message = `*${broadcast.Judul}*\n\n${broadcast.Konten}`
            client.sendMessage(`62${element.NoTelp}@c.us`, message)
        });
    } catch (error) {
        console.log(error)
    }
}