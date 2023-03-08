import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
const { Client, LocalAuth } = pkg

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true})
})

client.on('ready', () => {
    console.log('Client is ready!');
    client.sendMessage('6287888502866@c.us', `botnya baru nyala euy`)
})

export default client