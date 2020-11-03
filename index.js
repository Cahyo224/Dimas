const { create } = require('@open-wa/wa-automate')
const msgHandler = require('./msgHandler')
const welcome = require('./lib/welcome.js')
const fs = require('fs-extra')
const serverOption = {
    headless: true,
    cacheEnabled: false,
    useChrome: true,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Users\\Asus\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
    serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async (client) => {
        global.sclient = client
        global.sendingAnimatedSticker = []
        global.queueAnimatedSticker = []
        global.amdownloaden = []
        global.queuemp3 = []
        global.queuemp4 = []
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        // listening on message
        client.onMessage((message) => {
            msgHandler(client, message)
        })

        client.onGlobalParicipantsChanged((event) => {
            welcome(client, event)
        }) 
        
        client.onAddedToGroup((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 257) { 
            	client.sendText(chat.id, `This group only has ${totalMem} members, Its needs atleast 999 members to activate the services`).then(() => client.leaveGroup(chat.id))
            	client.deleteChat(chat.id)
            } else {
                client.sendText(chat.groupMetadata.id, `Thanks for adding me *${chat.contact.name}*. Use #help to see the usable commands`)
            }
        })
       
        // listening on Incoming Call
        client.onIncomingCall((call) => {
            client.sendText(call.peerJid, '...')
            client.contactBlock(call.peerJid)
            ban.push(call.peerJid)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        })
    }

create('session', serverOption)
    .then(async (client) => startServer(client))
    .catch((error) => console.log(error))
