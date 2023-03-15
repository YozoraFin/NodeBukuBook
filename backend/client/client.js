import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
const { Client, LocalAuth } = pkg

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true})
})

client.on('ready',async () => {
    console.log('Client is ready!');
    await new Promise(resolve => setTimeout(resolve, 20000))
})

export default client