const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const axios = require('axios')

async function gas() {
const { state, saveCreds } = await useMultiFileAuthState('sesi')
const s = makeWASocket({ auth: state, printQRInTerminal: true })
s.ev.on('creds.update', saveCreds)
s.ev.on('connection.update', (u) => {
if (u.qr) qrcode.generate(u.qr, { small: true })
if (u.connection === 'open') console.log('BOT HIDUP ✅')
})
s.ev.on('messages.upsert', async ({ messages }) => {
const m = messages[0]
if (!m.message || m.key.fromMe) return
const from = m.key.remoteJid
const txt = m.message.conversation || m.message.extendedTextMessage?.text || ''
if (txt.startsWith('.depo')) {
const nom = txt.split(' ')[1]
try {
const res = await axios.post('https://atlantich2h.com/api/v1/pembayaran', {
api_key: "4railtpsUBfPWIUlUJbzHscuu8EwLl9KskH7t3GzY96v1C8u0R5uR0k3KskH7t3GzY96v1C8u0R5uR0k3",
reff_id: 'R' + Date.now(),
nominal: nom,
type: 'qris'
})
if (res.data.status) await s.sendMessage(from, { image: { url: res.data.data.qr_link }, caption: `Bayar Rp${nom}` })
} catch (e) { console.log('Error API') }
}
})
}
gas()
