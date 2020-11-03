const { decryptMedia } = require('@open-wa/wa-decrypt')
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')
const fs = require('fs-extra')
const axios = require('axios')
const nrc = require('node-run-cmd')
const moment = require('moment-timezone')
const get = require('got')
const { exec } = require('child_process')
const nhentai = require('./lib/nhentai')
const { getLocationData } = require('./lib')
const wel = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const nsfwgrp = JSON.parse(fs.readFileSync('./lib/nsfw.json'))
let muted = JSON.parse(fs.readFileSync('./lib/muted.json'));
const { rugapoi } = require('./lib')
const akaneko = require('akaneko')
const speed = require("performance-now")
const NanaAPI = require("nana-api");
const google = require('google-it')
const fetch = require('node-fetch')
const bent = require('bent')
var request = require('request');
const mysql = require('mysql');
const CreateMYSQL = mysql.createConnection(
    {host: "127.0.0.1", user: "root", password: "", database: "test", charset: 'utf8mb4'}
);

const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'

// Author YogaSakti
const color = require('./lib/color')
const { doing } = require('./lib/translate.js')
const { translate } = require('./lib')

// Author MhankBarBar
const msgFilter = require('./lib/msgFilter')
const { liriklagu, quotemaker, wall, costom, artinama, bijak, weton, alay, namaninjaku } = require('./lib/functions')
const { help, info, } = require('./lib/help')
const ban = JSON.parse(fs.readFileSync('./lib/banned.json'))

// Author Shubham Badgujar
const feature = require('./lib/poll');

// Author FredWuz
const yt = require('./lib/yt')
const sendSticker = require('./lib/sendSticker')




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = msgHandler = async (cahyo, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, mentionedJidList, author, quotedMsgObj } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        const prefix = '!'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')

        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
        if (!isCmd && !isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
        if (!isCmd && isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        if (isCmd && !isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) 
        
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
        const botNumber = await cahyo.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await cahyo.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const isBanned = ban.includes(chatId)
        const isMuted = muted.includes(chatId)
        const botadmins = ['6288235881963@c.us'] //add the number of people that you want to the be bot admins
        const isbotadmin = botadmins.includes(sender.id)
		const ownerNumber = '6281331585418@c.us'
        const isOwner = sender.id === ownerNumber
        const pengirim = JSON.parse(fs.readFileSync('./lib/user.json'))
        const uwong = pengirim[Math.floor(Math.random()*pengirim.length)];
        const isPrivate = sender.id === chat.contact.id
        const isnsfw = nsfwgrp.includes(chat.id)
        const apiKey = '0kE6iZh2ynVBKXnz2xeb' // apikey you can get it at https://mhankbarbar.herokuapp.com/api
        const blockNumber = await cahyo.getBlockedIds()
        const isBlocked = blockNumber.includes(sender.id)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        global.pollfile = 'poll_Config_'+chat.id+'.json'
        global.voterslistfile = 'poll_voters_Config_'+chat.id+'.json'


        msgFilter.addFilter(from)

        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isBanned) {
            switch (command) {
        case 'find': {
            var cek = pengirim.includes(sender.id);
            const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
            if(!cek){
                return cahyo.reply(from, 'kamu belum terdaftar, untuk mendaftar kirim #daftar no wa kamu\ncontoh : #daftar 628523615486 ', id) //if user is not registered
            } else {           
                if (isMedia && args.length >= 1) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    const opo = body.slice(6)
                    //pengirim.push(from) //otomatis menambahkan nomor ke database
                    //fs.writeFileSync('./lib/user.json', JSON.stringify(pengirim))
                    cahyo.sendImage(uwong, imageBase64, 'gambar.jpeg',`${opo}\n\nHai, kamu mendapat pesan dari : wa.me/${from.replace(/[@c.us]/g, '')}`)
                        .then(() => cahyo.reply(from, 'Berhasil mengirim pesan\nTunggu pesan dari seseorang, kalo ga di bales coba lagi aja', id))
                } else if (isQuotedImage && args.length >= 1) {
                    const mediaData = await decryptMedia(quotedMsg, uaOverride)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    const opo = body.slice(6)
                    //pengirim.push(from) //otomatis menambahkan nomor ke database
                    //fs.writeFileSync('./lib/user.json', JSON.stringify(pengirim))
                    cahyo.sendImage(uwong, imageBase64, 'gambar.jpeg',`${opo}\n\nHai, kamu mendapat pesan dari : wa.me/${from.replace(/[@c.us]/g, '')}`)
                        .then(() => cahyo.reply(from, 'Berhasil mengirim pesan\nTunggu pesan dari seseorang, kalo ga di bales coba lagi aja', id))                
                } else if (args.length >= 1) {
                    const opo = body.slice(6)
                    //pengirim.push(from) //otomatis menambahkan nomor ke database
                    //fs.writeFileSync('./lib/user.json', JSON.stringify(pengirim))
                    cahyo.sendText(uwong, `${opo}\n\nHai, kamu mendapat pesan dari : wa.me/${from.replace(/[@c.us]/g, '').replace(/[-]/g, '')}`)
                        .then(() => cahyo.reply(from, 'Berhasil mengirim pesan\nTunggu pesan dari seseorang, kalo ga di bales coba lagi aja', id))   
                } else {
                    await cahyo.reply(from, 'Format salah! Untuk membuka daftar perintah kirim #menu', id)
                } 
            } 
        }     
            break
            case 'sim':
                if (isGroupMsg) {
                    let tek = body.slice(5);
                    const gan = require("urlencode");
                    const regex = gan(tek);
                    var url1 = "https://simsumi.herukuapp.com/api?text="+ regex +"&lang=ina";
                    axios.get(url1)
                    .then((result) => {
                    var b = JSON.parse(JSON.stringify(result.data));
                 if (b.success == ""){
                    cleint.reply(from, "maaf nggak Ngerti \n coba ketik !help ajalah", id);

                }else{
                    cahyo.reply(from, b.sucess, id)
                }
                })
                    .catch((err) => {
                    console.log(err);
                })
            }
            break
            case 'sticker':
            case 'stiker':
            case 'p':
            case 's':
                if (isMedia) {
                    if (type == 'video') {
                       if (message.duration < 10) {
                       sendSticker.sendAnimatedSticker(message)
                       } else {
                       await cahyo.reply(from, 'The given file is too large for converting', id)
                       }
                    } else if (type == 'image') {
                      const mediaData = await decryptMedia(message)
                      const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                      const baseImg = imageBase64.replace('video/mp4','image/gif')
                      await cahyo.sendImageAsSticker(from, baseImg)
                    }
                } else if (quotedMsg && quotedMsg.type == 'image') {
                    const mediaData = await decryptMedia(quotedMsg)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await cahyo.sendImageAsSticker(from, imageBase64)
                } else if (quotedMsg && quotedMsg.type == 'video') {
                          if (message.duration < 10) {
                          sendSticker.sendAnimatedSticker(message)
                          } else {
                          await cahyo.reply(from, 'The given file is too large for converting', id)
                          }
                } else {
                  cahyo.reply(from, 'You did not tag a picture or video, Baka', message.id)
                    }
            break
        case 'zelda':
        case 'sing-a-song':
            cahyo.sendPtt(from, './media/Zelda.mp3')
            break
        /*case 'donate':
            cahyo.sendLinkWithAutoPreview(from, '...', '...')
            break*/
       case 'mp3' :
            yt.mp3(message)
       case 'mp4' :
            break
            yt.mp4(message)
       case 'costom':
                arg = body.trim().split('|')
                if ((isMedia || isQuotedImage) && arg.length >= 2) {
                const top = arg[1]
                const bottom = arg[2]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await custom(getUrl, top, bottom)
                await cahyo.sendFile(from, ImageBase64, 'image.png', '', '...', true)
                } else {
                await cahyo.reply(from, 'Wrong Format!', id)
                }
                break
        /*case 'tsticker':
        case 'nobg':
            if (isMedia && type == 'image') {
              try {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                const base64img = imageBase64
                const filename = "./media/images/pic.jpg";
                //console.log(base64img)
                const outFile = './media/images/noBg.png'
                const result = await removeBackgroundFromImageBase64({ base64img, apiKey: 'GunuCfBSd83wuNeFaoPo6DJg', size: 'auto', type: 'auto', outFile })
                console.log(result.base64img)
                    await fs.writeFile(outFile, result.base64img)
                    await cahyo.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                } catch(err) {
                    console.log(err)
                }
            }
            break*/
        case 'qrcode':
           if(!args.lenght >= 2) return
           let qrcodes = body.slice(8)
           await cahyo.sendFileFromUrl(from, `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${qrcodes}`, 'gambar.png', 'Process sukses!')
           break
        case 'si': 
        case 'si':
        case 'sim':
        case 'sim':
            if (isGroupMsg) {
                    let tek = body.slice(3);
                     const gan = require("urlencode");
                     const regex = gan(tek);
                    var url1 = `https://simsumi.herokuapp.com/api?text=${regex}&lang=ina`
                    axios.get(url1)
                    .then((result) => {
                     var b = JSON.parse(JSON.stringify(result.data));
                  if (b.success == ""){
                      cahyo.reply(from, "Maaf kak , simi ga ngerti \n coba ketik #menu untuk nikmatin fitur lain", id);
                      
                  }else{
                  cahyo.reply(from, b.success, id)
                  }
                  })
                    .catch((err) => {
                  console.log(err);
                    })
            } if (!isGroupMsg) {
                let tek = body.slice(3);
                 const gan = require("urlencode");
                 const regex = gan(tek);
                var url1 = `https://simsumi.herokuapp.com/api?text=${regex}&lang=ina`
                axios.get(url1)
                .then((result) => {
                 var b = JSON.parse(JSON.stringify(result.data));
              if (b.success == ""){
                  cahyo.reply(from, "Maaf kak , simi ga ngerti \n coba ketik #menu untuk nikmatin fitur lain", id);
                  
              }else{
              cahyo.reply(from, b.success, id)
              }
              })
                .catch((err) => {
              console.log(err);
                })
        }
        break
       /*case 'tts':
        	if (args.length == 0) return cahyo.reply(from, 'Wrong Fromat!')
                const ttsEn = require('node-gtts')('en')
	        const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const dataText = body.slice(8)
            if (dataText === '') return cahyo.reply(from, 'Baka?', message.id)
            if (dataText.length > 250) return cahyo.reply(from, 'Unable to convert', message.id)
            var dataBhs = body.slice(5, 7)
	        if (dataBhs == 'id') {
		    } else if (dataBhs == 'en') {
                ttsEn.save('./tts/resEn.mp3', dataText, function () {
                    cahyo.sendPtt(from, './media/tts/resEn.mp3', message.id)
                })
		    } else if (dataBhs == 'jp') {
                ttsJp.save('./tts/resJp.mp3', dataText, function () {
                    cahyo.sendPtt(from, './media/tts/resJp.mp3', message.id)
                })
            } else if (dataBhs == 'ar') {
                ttsJp.save('./tts/resAr.mp3', dataText, function () {
                    cahyo.sendPtt(from, './media/tts/resAr.mp3', message.id)
                })
		    } else {
		        cahyo.reply(from, 'Currently only English and Japanese are supported!', message.id)
            }
            break*/
        case 'quotemaker':
            arg = body.trim().split('|')
            if (arg.length >= 3) {
            cahyo.reply(from, 'Processing...', message.id) 
            const quotes = arg[1]
            const author = arg[2]
            const theme = arg[3]
            try {
            const resolt = await quotemaker(quotes, author, theme)
            cahyo.sendFile(from, resolt, 'quotesmaker.jpg','neh...')
            } catch {
            cahyo.reply(from, 'I\'m afraid to tell you that the image failed to process', message.id)
            }
            } else {
            cahyo.reply(from, 'Usage: \n!quotemaker |text|watermark|theme\n\nEx :\n!quotemaker |...|...|random', message.id)
            }
            break
        /*case 'cersex1':
            const cersexx = await get.get('https://masgi.herokuapp.com/api/cersex1').json()
            const ceritasex = `*Judul :* ${data.judul}\n*Article :*\n${data.article}`
            cahyo.reply(from, ceritasex, id)
            break
        case 'cersex2':
            const cersexx = await get.get('https://masgi.herokuapp.com/api/cersex2').json()
            const ceritasex = `*Judul :* ${data.judul}\n*Article :*\n${data.article}`
            cahyo.reply(from, ceritasex, id)
            break
        case 'randombokep':
            const bkpnya2 = await get.get('https://masgi.herokuapp.com/api/indohot').json()
            const { data } = bkpnya2
            const capsbkp2 = `*Judul :* ${data.judul}\n*Genre :* ${data.genre}\n*Durasi :* ${data.durasi}\n*Link :* ${data.url}`
            cahyo.reply(from, capsbkp2, id)
            break*/
            case 'afk':
                if(isGroupMsg)
                {
                    CreateMYSQL.query(
                        "SELECT 1 FROM `afk` WHERE `nomer` = ? AND `groupid` = ?",[author.split('@')[0], from.split('-')[1].split('@')[0]],
                        async function (err, result) {
                            if(err) console.log(err)
                            if(result.length == 0)
                            {
                                const mmk = body.slice(5)
                                if(body.toLowerCase() == '!afk')
                                {
                                    CreateMYSQL.query(
                                        'INSERT INTO `afk` SET ?', {nomer: author.split('@')[0],groupid: from.split('-')[1].split('@')[0], nama: message.chat.contact.name, reason: 'null', time: moment().format('YYYY-MM-DD HH:mm:ss')},
                                        async function (err, result) {
                                            if(err) console.log(err)
                                            await cahyo.sendTextWithMentions(from, `@${author.split('@')[0]} Sekarang AFK!`, id)
                                        })
                                }else{
                                    CreateMYSQL.query(
                                        'INSERT INTO `afk` SET ?', {nomer: author.split('@')[0],groupid: from.split('-')[1].split('@')[0], nama: message.chat.contact.name, reason: mmk, time: moment().format('YYYY-MM-DD HH:mm:ss')},
                                        async function (err, result) {
                                            if(err) console.log(err)
                                            await cahyo.sendTextWithMentions(from, `@${author.split('@')[0]} Sekarang AFK!`, id)
                                        })
                                }
                               
                            }else{
                                const mmk = body.slice(5)
                                if(body.toLowerCase() == '!afk')
                                {
                                    CreateMYSQL.query(
                                        'UPDATE `afk` SET ? WHERE `nomer` = ? AND `groupid` = ?', [{reason: 'null',time: moment().format('YYYY-MM-DD HH:mm:ss')}, author.split('@')[0],from.split('-')[1].split('@')[0]],
                                        async function (err, result) {
                                            if(err) console.log(err)
                                            await cahyo.sendTextWithMentions(from, `@${author.split('@')[0]} Sekarang AFK!!`, id)
                                        })
                                }else{
                                    CreateMYSQL.query(
                                        'UPDATE `afk` SET ? WHERE `nomer` = ? AND `groupid` = ?', [{reason: mmk, time: moment().format('YYYY-MM-DD HH:mm:ss')}, author.split('@')[0],from.split('-')[1].split('@')[0]],
                                        async function (err, result) {
                                            if(err) console.log(err)
                                            await cahyo.sendTextWithMentions(from, `@${message.author.split('@')[0]} Sekarang AFK Su!`, id)
                                        })
                                }  
                            }
                        })
                }else{
                    await cahyo.reply(from, `Hanya bisa digunakan digrup!.`, id)
                }
            break
       case 'poll':
            feature.getpoll(cahyo, message, pollfile, voterslistfile)
            break    
       case 'vote' :
            feature.voteadapter(cahyo, message, pollfile, voterslistfile)
            break
       case 'resetpoll':
            feature.adminpollreset(cahyo, message, message.body.slice(10), pollfile, voterslistfile)
            break
       case 'add': 
            feature.addcandidate(cahyo, message, message.body.slice(4), pollfile, voterslistfile)
            break
        case 'nekopoi':
            cahyo.sendText(from, `Sedang mencari video terbaru dari website nekopoi...`)
            rugapoi.getLatest()
            .then((result) => {
                rugapoi.getVideo(result.link)
                .then((res) => {
                    let heheq = '\n'
                    for (let i = 0; i < res.links.length; i++) {
                        heheq += `${res.links[i]}\n`
                    }
                    cahyo.reply(from, `Title: ${res.title}\n\nLink:\n${heheq}\nmasih tester bntr :v`)
                })
            })
            break
    case 'ptl2': {
            var items = ["ullzang girl", "cewe cantik", "hijab cantik", "korean girl"];
            var cewe = items[Math.floor(Math.random() * items.length)];
            url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
            axios.get(url)
                .then((result) => {
                var b = JSON.parse(JSON.stringify(result.data));
                var cewek =  b[Math.floor(Math.random() * b.length)];
            imageToBase64(cewek) // Path to the image
                .then(
            (response) => {
                var buf = Buffer.from(response, 'base64'); // Ta-da 
                conn.sendMessage(
            id,
            buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
        break
        case 'lasegar2':
            q2 = Math.floor(Math.random() * 10) + 1;
            cahyo.sendFileFromUrl(from, 'https://lines.masgimenz.com/gambar/'+q2+'.jpg','halo.jpg','Hai Sayang ');
            break
        case 'ptl1':
            const pptl = ["https://i.pinimg.com/564x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/236x/98/08/1c/98081c4dffde1c89c444db4dc1912d2d.jpg","https://i.pinimg.com/236x/a7/e2/fe/a7e2fee8b0abef9d9ecc8885557a4e91.jpg","https://i.pinimg.com/236x/ee/ae/76/eeae769648dfaa18cac66f1d0be8c160.jpg","https://i.pinimg.com/236x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/564x/78/7c/49/787c4924083a9424a900e8f1f4fdf05f.jpg","https://i.pinimg.com/236x/eb/05/dc/eb05dc1c306f69dd43b7cae7cbe03d27.jpg","https://i.pinimg.com/236x/d0/1b/40/d01b40691c68b84489f938b939a13871.jpg","https://i.pinimg.com/236x/31/f3/06/31f3065fa218856d7650e84b000d98ab.jpg","https://i.pinimg.com/236x/4a/e5/06/4ae5061a5c594d3fdf193544697ba081.jpg","https://i.pinimg.com/236x/56/45/dc/5645dc4a4a60ac5b2320ce63c8233d6a.jpg","https://i.pinimg.com/236x/7f/ad/82/7fad82eec0fa64a41728c9868a608e73.jpg","https://i.pinimg.com/236x/ce/f8/aa/cef8aa0c963170540a96406b6e54991c.jpg","https://i.pinimg.com/236x/77/02/34/77023447b040aef001b971e0defc73e3.jpg","https://i.pinimg.com/236x/4a/5c/38/4a5c38d39687f76004a097011ae44c7d.jpg","https://i.pinimg.com/236x/41/72/af/4172af2053e54ec6de5e221e884ab91b.jpg","https://i.pinimg.com/236x/26/63/ef/2663ef4d4ecfc935a6a2b51364f80c2b.jpg","https://i.pinimg.com/236x/2b/cb/48/2bcb487b6d398e8030814c7a6c5a641d.jpg","https://i.pinimg.com/236x/62/da/23/62da234d941080696428e6d4deec6d73.jpg","https://i.pinimg.com/236x/d4/f3/40/d4f340e614cc4f69bf9a31036e3d03c5.jpg","https://i.pinimg.com/236x/d4/97/dd/d497dd29ca202be46111f1d9e62ffa65.jpg","https://i.pinimg.com/564x/52/35/66/523566d43058e26bf23150ac064cfdaa.jpg","https://i.pinimg.com/236x/36/e5/27/36e52782f8d10e4f97ec4dbbc97b7e67.jpg","https://i.pinimg.com/236x/02/a0/33/02a033625cb51e0c878e6df2d8d00643.jpg","https://i.pinimg.com/236x/30/9b/04/309b04d4a498addc6e4dd9d9cdfa57a9.jpg","https://i.pinimg.com/236x/9e/1d/ef/9e1def3b7ce4084b7c64693f15b8bea9.jpg","https://i.pinimg.com/236x/e1/8f/a2/e18fa21af74c28e439f1eb4c60e5858a.jpg","https://i.pinimg.com/236x/22/d9/22/22d9220de8619001fe1b27a2211d477e.jpg","https://i.pinimg.com/236x/af/ac/4d/afac4d11679184f557d9294c2270552d.jpg","https://i.pinimg.com/564x/52/be/c9/52bec924b5bdc0d761cfb1160865b5a1.jpg","https://i.pinimg.com/236x/1a/5a/3c/1a5a3cffd0d936cd4969028668530a15.jpg"]
            let pep = pptl[Math.floor(Math.random() * pptl.length)]
            cahyo.sendFileFromUrl(from, pep, 'pptl.jpg', 'Follow ig : https://www.instagram.com/ptl_repost untuk mendapatkan penyegar timeline lebih banyak', message.id)
            break
        case 'lasegar1':
            const romjie = ["https://i.pinimg.com/564x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/236x/98/08/1c/98081c4dffde1c89c444db4dc1912d2d.jpg","https://i.pinimg.com/236x/a7/e2/fe/a7e2fee8b0abef9d9ecc8885557a4e91.jpg","https://i.pinimg.com/236x/ee/ae/76/eeae769648dfaa18cac66f1d0be8c160.jpg","https://i.pinimg.com/236x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/564x/78/7c/49/787c4924083a9424a900e8f1f4fdf05f.jpg","https://i.pinimg.com/236x/eb/05/dc/eb05dc1c306f69dd43b7cae7cbe03d27.jpg","https://i.pinimg.com/236x/d0/1b/40/d01b40691c68b84489f938b939a13871.jpg","https://i.pinimg.com/236x/31/f3/06/31f3065fa218856d7650e84b000d98ab.jpg","https://i.pinimg.com/236x/4a/e5/06/4ae5061a5c594d3fdf193544697ba081.jpg","https://i.pinimg.com/236x/56/45/dc/5645dc4a4a60ac5b2320ce63c8233d6a.jpg","https://i.pinimg.com/236x/7f/ad/82/7fad82eec0fa64a41728c9868a608e73.jpg","https://i.pinimg.com/236x/ce/f8/aa/cef8aa0c963170540a96406b6e54991c.jpg","https://i.pinimg.com/236x/77/02/34/77023447b040aef001b971e0defc73e3.jpg","https://i.pinimg.com/236x/4a/5c/38/4a5c38d39687f76004a097011ae44c7d.jpg","https://i.pinimg.com/236x/41/72/af/4172af2053e54ec6de5e221e884ab91b.jpg","https://i.pinimg.com/236x/26/63/ef/2663ef4d4ecfc935a6a2b51364f80c2b.jpg","https://i.pinimg.com/236x/2b/cb/48/2bcb487b6d398e8030814c7a6c5a641d.jpg","https://i.pinimg.com/236x/62/da/23/62da234d941080696428e6d4deec6d73.jpg","https://i.pinimg.com/236x/d4/f3/40/d4f340e614cc4f69bf9a31036e3d03c5.jpg","https://i.pinimg.com/236x/d4/97/dd/d497dd29ca202be46111f1d9e62ffa65.jpg","https://i.pinimg.com/564x/52/35/66/523566d43058e26bf23150ac064cfdaa.jpg","https://i.pinimg.com/236x/36/e5/27/36e52782f8d10e4f97ec4dbbc97b7e67.jpg","https://i.pinimg.com/236x/02/a0/33/02a033625cb51e0c878e6df2d8d00643.jpg","https://i.pinimg.com/236x/30/9b/04/309b04d4a498addc6e4dd9d9cdfa57a9.jpg","https://i.pinimg.com/236x/9e/1d/ef/9e1def3b7ce4084b7c64693f15b8bea9.jpg","https://i.pinimg.com/236x/e1/8f/a2/e18fa21af74c28e439f1eb4c60e5858a.jpg","https://i.pinimg.com/236x/22/d9/22/22d9220de8619001fe1b27a2211d477e.jpg","https://i.pinimg.com/236x/af/ac/4d/afac4d11679184f557d9294c2270552d.jpg","https://i.pinimg.com/564x/52/be/c9/52bec924b5bdc0d761cfb1160865b5a1.jpg","https://i.pinimg.com/236x/1a/5a/3c/1a5a3cffd0d936cd4969028668530a15.jpg"]
            let pap = romjie[Math.floor(Math.random() * romjie.length)]
            cahyo.sendFileFromUrl(from, pap, 'romjie.jpg', 'Hai Sayang', message.id)
            break
        case 'googleimage': {
            let goo = body.slice(13)
            let jum = Number(tanya.split('.')[1]) || 2
                if (jum > 10) return cahyo.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
            if (args.length ==1) return await cahyo.reply(from, 'Format: !googleimage [teks]\ncontoh\n!googleimage kaori miyazono')
                cahyo.reply(from, 'Tunggu ya, sedang prosess', id)
                const tik = await get.get('http://api.fdci.se/rep.php?gambar=').json()
            const {code, status, result} = tik
            if(code != "200") return cahyo.reply(from, 'mungkin servernya eror', id)
            const gambar = result.sice(0, 2)
            gambar.forEarch(function(g){
                cahyo.senFileFromUrl(from, g, 'google.jpg', '', id)
              })
          }
          break   
        case 'daftar': { //menambahkan nomor ke database 
                if (!args.length >= 1) return cahyo.reply(from, 'Nomornya mana kak?\ncontoh: #daftar 6285226236155')  
                const text = body.slice(8).replace(/[-\s+]/g,'') + '@c.us'
                var cek = pengirim.includes(text);
                if(cek){
                    return cahyo.reply(from, 'Nomor sudah ada di database', id) //if number already exists on database
                } else {
                    const mentah = await cahyo.checkNumberStatus(text) //VALIDATE WHATSAPP NUMBER
                    const hasil = mentah.canReceiveMessage ? `Sukses menambahkan nomer ke database\nTotal data nomer sekarang : *${pengirim.length}*` : false
                    if (!hasil) return cahyo.reply(from, 'Nomor WhatsApp tidak valid [ Tidak terdaftar di WhatsApp ]', id) 
                    {
                    pengirim.push(mentah.id._serialized)
                    fs.writeFileSync('./lib/user.json', JSON.stringify(pengirim))
                        cahyo.sendText(from, hasil)
                    }
                }
        }
            break                                     
        case 'remove': //menghapus nomor dari database
            if (!isOwner) return cahyo.reply(from, 'Fitur ini hanya dapat digunakan oleh admin bot')  
            if (!args.length >= 1) return cahyo.reply(from, 'Masukkan nomornya, *GUNAKAN AWALAN 62* contoh: 6285226236155')  
            {
                let inx = pengirim.indexOf(args[0]+'@c.us')
                pengirim.splice(inx,1)
                fs.writeFileSync('./lib/user.json', JSON.stringify(pengirim))
                cahyo.reply(from, 'Sukses menghapus nomor dari database', id)
            }
            break
        case 'list': //melihat daftar nomor di database 
            if (!isOwner) return cahyo.reply(from, 'Fitur ini hanya dapat digunakan oleh admin bot')  
            const num = fs.readFileSync('./lib/user.json')
            const daftarnum = JSON.parse(num)
            const hasil = daftarnum.toString().replace(/['"@c.us]/g,'').replace(/[,]/g, '\n');
            cahyo.sendText(from, hasil) 
            break
        case 'reverse':
            if (args.length < 1) return cahyo.reply(from, '[ERROR]')
            await cahyo.sendText(from, body.slice('8').split('').reverse().join(''))
            break
        case 'speed':
            const timestamp = speed();
            const latensi = speed() - timestamp
            cahyo.reply(`${latensi.toFixed(5)} detik`)
            break
        case 'spamcall':
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const spam = await slicedArgs.join(' ')
            console.log(spam)
            const call2 = await axios.get('https://mhankbarbar.herokuapp.com/api/spamcall?no=' + spam)
            const { logs } = call2.data
                await cahyo.sendText(from, `Logs : ${logs}` + '.')
            break
        case 'news':
          const respons = await axios.get('http://newsapi.org/v2/top-headlines?country=id&apiKey=b2d3b1c264c147ae88dba39998c23279')
          const { totalResults, articles } = respons.data
          res = totalResults
          if (args[1] >= totalResults) {
            res = totalResults
          } else {
            res = args[1]
          }
          i = 0
          pesan = '_*Berita Terbaru Hari Ini*_\n\n'
          for (const isi of articles) {
            i++
            pesan = pesan + i + '. ' + '_' + isi.title + '_' + '\n' + isi.publishedAt + '\n' + isi.description + '\n' + isi.url
            if (i<res) {
              pesen = pesan + '\n\n'
            } else if(i > res){
              break
            }
          }
          await cahyo.sendText(from, pesan)
             break
        case 'fakta': {
            const fetch = require("node-fetch");
            fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-fakta-unik.txt')
            .then(res => res.text())
            .then(body => {
            let tod = body.split("\n");
            let pjr = tod[Math.floor(Math.random() * tod.length)];
            cahyo.reply(from, pjr);
            });
        }
            break
        case 'pantun': {
            const fetch = require("node-fetch");
            fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-pantun-pakboy.txt')
            .then(res => res.text())
            .then(body => {
            let tod = body.split("\n");
            let pjr = tod[Math.floor(Math.random() * tod.length)];
            cahyo.reply(from, pjr.replace(/pjrx-line/g,"\n"));
            });
        }
            break
        case 'animehd': {
            const fetch = require("node-fetch");
            const imageToBase64 = require('image-to-base64');
            fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-gambar-anime.txt')
            .then(res => res.text())
            .then(body => {
            let tod = body.split("\n");
            let pjr = tod[Math.floor(Math.random() * tod.length)];
            cahyo.reply(from, pjr.replace(/pjrx-line/g,"\n"));
            imageToBase64(pjr)
            cahyo.sendFile(from, 'image/jpeg','anime.jpeg', '_*Processing Sukses #HikariPoi BOT*_');
            });
        }
            break
        case 'nama': {
            var nama = body.split("!nama ")[1];
            var req = urlencode(nama.replace(/ /g,"+"));
            request.get({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'http://www.primbon.com/arti_nama.php?nama1='+ req +'&proses=+Submit%21+',
            },function(error, response, body){
            let $ = cheerio.load(body);
            var y = $.html().split('arti:')[1];
            var t = y.split('method="get">')[1];
            var f = y.replace(t ," ");
            var x = f.replace(/<br\s*[\/]?>/gi, "\n");
            var h  = x.replace(/<[^>]*>?/gm, '');
            cahyo.reply(
            `
      *Arti Dari Namamu*

  ----------------------------------
         Nama _*${nama}*_ ${h}
  ----------------------------------

        *_Arti Nama By InsideHeartz_*
`
        );
});
}
        break
        case 'twitterinfo': {
                if (args.length === 1)  return await cahyo.reply(from, 'Kirim perintah !twitterinfo [username]\nConntoh !twitterinfo arianagrande', id)
                const twtinfo = await get.get(`https://rest.farzain.com/api/twitter.php?id=${args[1]}&apikey=4mpk6473CGeRzJbWi5Tz3pMWF`).json()
                if (twtinfo.result.profilepicture == '') return await cahyo.reply(from, twtinfo.result.name, id)
                const { result } = twtinfo
                const { name, screen_name, description, profilebanner, profilepicture, followers, following, likes, tweet, joined} = result
                const profil = profilepicture.replace(/\\/g,'')
                const caps1 = `👉 Nama : ${name}\n👉 Username : ${screen_name}\n👉 Jumlah Followers : ${followers}\n👉 Jumlah Following : ${following}\n👉 Jumlah like : ${likes}\n👉 Jumlah tweet : ${tweet}\n👉 Deskripsi : ${description}\n\n👉 Bergabung pada : ${joined}\n`
                await cahyo.sendFileFromUrl(from, profil, 'Profiletwt.jpg', caps1, id)}
                break
        case 'trendingtwitter': {
                    const respons = await axios.get('https://api.haipbis.xyz/trendingtwitter/id')
                    const { result, datetime } = respons.data
                    res = 38
                    if (args[0] >= 38) {
                      res = 38
                    } else {
                      res = args[0]
                    }
                    i = 0
                    pesan = `={ Trending Twitter Terbaru Hari Ini }=\n\n${datetime}\n`
                    for (const isi of result) {
                      i++
                      pesan = pesan + `\n` + `(${i})\n` + '👉 Judul : ' + isi.title + '' + '\n*👉 Link* : ' + isi.link + '\n👉 Total Penyelusuran : ' + isi.count + '\n\n'
                      if (i<res) {
                        pesen = pesan + '\n\n'
                      } else if(i > res){
                        break
                      }
                    }
                    await cahyo.reply(from, pesan, id)}
                break
        case 'toimg': {
            if(quotedMsg && quotedMsg.type == 'sticker'){
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await cahyo.sendFile(from, imageBase64, 'imagesticker.jpg', 'Tuh dah Jadi', id)
            } else if (!quotedMsg) return cahyo.reply(from, 'tidak ada sticker yang di balas!', id)}
            break
        case 'toemote': {
            if(quotedMsg && quotedMsg.type == 'emote'){
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await cahyo.sendFile(from, imageBase64, 'emoted.jpg', 'Tuh dah Jadi', id)
            } else if (!quotedMsg) return cahyo.reply(from, 'tidak ada emote yang di balas!', id)}
            break
        case 'tovid': {
            if(quotedMsg && quotedMsg.type == 'gif'){
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await cahyo.sendFile(from, imageBase64, 'gif.mp4', 'Tuh dah Jadi', id)
            } else if (!quotedMsg) return cahyo.reply(from, 'tidak ada sticker yang di balas!', id)}
            break
        case 'compress': {
            if(quotedMsg && quotedMsg.type == 'image'){
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await cahyo.sendFile(from, imageBase64, 'Compressimage.jpg', 'Tuh dah Jadi', id)
            } else if (!quotedMsg) return cahyo.reply(from, 'tidak ada gambar yang di balas!', id)}
            break
        case 'wa.me':
        case 'wame':
            await cahyo.reply(from, `*Neh Mhank Link Nomor Wa Lu ${pushname}*\n\n*wa.me/${sender.id.replace(/[@c.us]/g, '')}*\n\n*Atau*\n\n*api.whatsapp.com/send?phone=${sender.id.replace(/[@c.us]/g, '')}*`)
            break
        break
    case 'nhder':
            if (args.length >=2){
            await cahyo.simulateTyping(from, true)
            cahyo.sendText(from, '⏳ Tunggu yaa, sedang proses . . . ⏳')
            const code = args[1]
            const url = 'https://nhder.herokuapp.com/download/nhentai/'+code+'/zip'
                const short = []
                const shortener = await urlShortener(url)
                console.log('Shortlink: '+ shortener)
                url['short'] = shortener
                short.push(url)
                const caption = `Link: ${shortener}\n\nDonasi: kamu dapat membantuku beli cendol dengan menyawer melalui https://saweria.co/donate/yuzusa atau mentrakteer melalui https://trakteer.id/yuzusaha \nTerimakasih.`
                cahyo.sendText(from, caption)
                } else {
            cahyo.sendText(from, 'Maaf tolong masukan code')
        }
            break
        case 'mypc':
            await cahyo.reply(from,`Penggunaan RAM: *${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB*\nCPU: *${os.cpus().length} ${os.cpus()[0].model}*`)
            break
        case 'shortlink':
            if (args.length !== 1) return cahyo.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(args[0])) return cahyo.reply(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            const shortlink = await urlShortener(args[0]);
            await cahyo.reply(from, shortlink);
            break
       case 'translate':
            arg = body.trim().split(' ')
            if (arg.length != 2) return cahyo.reply(from, 'Wrong Format!', id)
            if (!quotedMsg) return cahyo.reply(from, 'Wrong Format!', id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
			const sendText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
            translate(quoteText, arg[1])
                .then((result) => cahyo.sendText(from, result))
                .catch(() => cahyo.sendText(from, 'An error occured!'))
            break
         case 'textmaker':
                arg = body.trim().split('|')
                if ((isMedia || isQuotedImage) && arg.length >= 2) {
                const top = arg[1]
                const bott = arg[2]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await custom(getUrl, top, bott)
                await cahyo.sendFile(from, ImageBase64, 'image.png','neh...')
                } else {
                await cahyo.reply(from, 'Wrong Format!', id)
                }
                break
        case 'bijak':
            const getBijak = await bijak()
            cahyo.reply(from, getBijak);
            break
        case 'artinama':
            if (args.length == 2) {
            const nama = args[1]
            const result = await artinama(nama)
            cahyo.reply(from, result)
            }
            break
        case 'weton':
            if (args.length == 4) {
                const tgl = args[1]
                const bln = args[2]
                const thn = args[3]
                const result = await weton(tgl, bln, thn)
            cahyo.reply(from, result)
            }
            break
        case 'alay':
            if (args.length == 2) {
                const kata = args[1]
                const result = await alay(kata)
            cahyo.reply(from, result)
            }
            break
        case 'namaninjaku':
            if (args.length == 2) {
                const nama = args[1]
                const result = await namaninjaku(nama)
                cahyo.reply(from, result)
            }
                    break
                    case 'google':
            if (args.length === 1) return cahyo.reply(from, `Kirim perintah Google search dengan cara ketik perintah :\n*!google* _Query search_\nContoh :\n*!google* _Detik News hari ini_`, id)
             const googleQuery = body.slice(8)
            if(googleQuery == undefined || googleQuery == ' ') return cahyo.reply(from, `_Kesalahan tidak bisa menemukan hasil dari ${googleQuery}_`, id)
            google({ 'query': googleQuery }).then(results => {
            //console.log(results)
            let captserch = `_*Hasil Pencarian Google Dari ${googleQuery}*_\n`
            for (let i = 0; i < results.length; i++) {
                captserch +=  `\n*Judul* : ${results[i].title}\n*Deskripsi* : ${results[i].snippet}\n*Link* : ${results[i].link}\n`
            }
            //let vars = results[0]
                cahyo.reply(from, captserch, id);
            }).catch(e => {
                console.log(e)
                cahyo.sendText(ownerNumber, e);
            })
            await cahyo.sendSeen(from)
            break
                    case 'corona':
                        function intl(str) {
                            var nf = Intl.NumberFormat();
                            return nf.format(str);
                        }
                        if(args[1]){
                            if(args[1] === 'prov'){
                                const province = body.slice(13).toLowerCase()
                                axios.get('https://indonesia-covid-19.mathdro.id/api/provinsi/').then(({data}) => {
                                    var founded = false
                                    data.data.find(i => {
                                        if(i.provinsi.toLowerCase() == province){
                                            founded = true
                                            cahyo.reply(from, `_*Kasus COVID19 di ${i.provinsi}*_
~> Positif : ${intl(i.kasusPosi)} kasus   
~> Sembuh : ${intl(i.kasusSemb)} kasus
~> Meninggal : ${intl(i.kasusMeni)} kasus

_*Tips kesehatan*_
- Mencuci tangan dengan benar
- Menggunakan masker
- Menjaga daya tahan tubuh
- Menerapkan physical distancing

_*#HikariPoi BOT Information*_`)
                                        }
                                    })
                                    if(founded == false) return cahyo.reply(from, `Provinsi ${province} tidak valid, gunakan format formal seperti : DKI Jakarta`)
                                })
                            }
                        }else{
                            corona().then(hasilCorona => {
                                cahyo.sendText(from, hasilCorona)
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                        break
        /*case 'waifu':
            const waifu = await axios.get('https://mhankbarbar.herokuapp.com/api/waifu')
            console.log(waifu.image)
            cahyo.sendFileFromUrl(from, waifu.data.image, 'Waifu.jpg', `❤️ Name : ${waifu.data.name}\n🎉️ Description : ${waifu.data.desc}\n\n❇️ Source : ${waifu.data.source}`, id)
            break*/ 
        case 'husbando':
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            cahyo.sendFileFromUrl(from, rindKiy.image, 'Husbando.jpg', rindKiy.teks, id)
            break
        case 'bc':
        if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            let msg = body.slice(4)
            const chatz = await cahyo.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await cahyo.getChatById(ids)
                if (!cvk.isReadOnly) cahyo.sendText(ids, `${msg}`)
            }
            cahyo.reply(from, 'Broadcast Success!', message.id)
            break
        case 'user':
        const username = body.slice(6)
        const result = await axios.get(`https://api.jikan.moe/v3/user/${username}`)
        const jikan =  result.data

var Data = `🔖️ Username: ${jikan.username}

📒️ User ID: ${jikan.user_id}

❤️ Gender: ${jikan.gender}

🌍️ Location: ${jikan.location}

📆️ Joined: ${jikan.joined}

⭐️ Anime Stats ⭐️

Days Watched: ${jikan.anime_stats.days_watched}

Mean Score: ${jikan.anime_stats.mean_score}

Currently Watching: ${jikan.anime_stats.watching}

Completed: ${jikan.anime_stats.completed}

On Hold: ${jikan.anime_stats.on_hold}

Dropped: ${jikan.anime_stats.dropped}

Plan to Watch: ${jikan.anime_stats.plan_to_watch}

🎯️ Manga Stats 🎯️

Days Read: ${jikan.manga_stats.days_read}

Mean Score: ${jikan.manga_stats.mean_score}

Currently Reading: ${jikan.manga_stats.reading}

Completed: ${jikan.manga_stats.completed}

On Hold: ${jikan.manga_stats.on_hold}

Dropped: ${jikan.manga_stats.dropped}

Plan to Read: ${jikan.manga_stats.plan_to_read}`
        await cahyo.sendFileFromUrl(from, `${jikan.image_url}`,`user.png`, Data)
        break
        break                            
        case 'ban':
            if (!isOwner) return cahyo.reply(from, 'Fitur ini hanya dapat digunakan oleh admin bot')  
            if (!args.length >= 1) return cahyo.reply(from, 'Masukkan nomornya, *GUNAKAN AWALAN 62* contoh: 6285226236155')  
            {
                const text = body.slice(7).replace(/[-\s+]/g,'')
                ban.push(text+'@c.us')
                fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
                cahyo.reply(from, 'Sukses banned', message.id)
            }
            break 
        case 'unban':
            if (!isOwner) return cahyo.reply(from, 'Fitur ini hanya dapat digunakan oleh admin bot')  
            if (!args.length >= 1) return cahyo.reply(from, 'Masukkan nomornya, *GUNAKAN AWALAN 62* contoh: 6285226236155')  
            {
            const text = body.slice(7).replace(/[-\s+]/g,'')
            ban.splice(text, 1)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
            cahyo.reply(from, 'Succes unban target!', message.id)
            }
            break
     case 'fanart': {
        if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/anime',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/nime.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/nime.jpg', 'nime.jpg', 'Nih Bro', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
     case 'randomhug': {
        if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/hug',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/hug.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/hug.jpg', 'hug.jpg', 'Nih Bro', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
     case 'randombaguette': {
        if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/baguette',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/baguette.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/baguette.jpg', 'baguette.jpg', 'Nih Bro', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
     case 'randomyuri': {
        if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/yuri',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/yuri.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/yuri.jpg', 'yuri.jpg', 'Nih Bro', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
     case 'randomdva': {
        if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/dva',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/dva.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/dva.jpg', 'dva.jpg', 'Nih Bro', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
        case 'ara' :
          cahyo.sendStickerfromUrl(from, 'https://ih1.redbubble.net/image.930182194.9969/st,small,507x507-pad,600x600,f8f8f8.jpg', { method: 'get' })
break
     case 'randomneko': {
        if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/neko',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/neko.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/neko.jpg', 'neko.jpg', 'Nih Nekonya', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
     case 'randomtrap': {
        if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/trap',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/trap.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/trap.jpg', 'trap.jpg', 'Ups wkwkwkwk', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
     case 'nsfwneko': {
        if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/nsfwneko',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/nsfwneko.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/nsfwneko.jpg', 'nfswneko.jpg', 'Nih Bro', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
case 'fanart18': {
    if (!isOwner) return await cahyo.reply(from, 'Hiya Kagak Bisa wkwkwkwkwkwk', id)
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/hentai',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/ok.jpg', (error, stdout, stderr) => {
cahyo.sendFile(from, './anime/ok.jpg', 'ok.jpg', 'Nih Bro', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
        case 'covid':
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const country = await slicedArgs.join(' ')
            console.log(country)
            const response2 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response2.data
                await cahyo.sendText(from, '🌎️Covid Info -' + country + ' 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.')
            break
        case 'ping':
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if (!isGroupMsg) return cahyo.reply(from, 'Baka!, This command can only be used in groups', message.id)
            const groupMem = await cahyo.getGroupMembers(groupId)
            let hehe = `${body.slice(6)} - ${pushname} \n`
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '✨️'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '----------------------'
            await cahyo.sendTextWithMentions(from, hehe)
            break
        case 'walldekstop':
            cahyo.sendFileFromUrl(from, 'https://source.unsplash.com/1920x1080/?nature','wp.jpeg', '_*Processing Sukses #HikariPoi BOT*_')
            break
        case 'igstalk':
            if (args.length === 1)  return cahyo.reply(from, 'Kirim perintah *!igStalk @username*\nConntoh *!igStalk @duar_amjay*', id)
            const stalk = await get.get(`https://mhankbarbar.herokuapp.com/api/stalk?username=${args[1]}&apiKey=${apiKey}`).json()
            if (stalk.error) return cahyo.reply(from, stalk.error, id)
            const { Biodata, Jumlah_Followers, Jumlah_Following, Jumlah_Post, Name, Username, Profile_pic } = stalk
            const caps = `➸ *Nama* : ${Name}\n➸ *Username* : ${Username}\n➸ *Jumlah Followers* : ${Jumlah_Followers}\n➸ *Jumlah Following* : ${Jumlah_Following}\n➸ *Jumlah Postingan* : ${Jumlah_Post}\n➸ *Biodata* : ${Biodata}`
            await cahyo.sendFileFromUrl(from, Profile_pic, 'Profile.jpg', caps, id)
            break
        case 'test':
            cahyo.sendFile(from, '.lib/img/test.mp4','test.mp4', id)
            break
        case 'ceklokasi':
            console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
            const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
            if (zoneStatus.kode !== 200) client.sendText(from, 'Maaf, Terjadi error ketika memeriksa lokasi yang anda kirim.')
            let data = ''
            for (let i = 0; i < zoneStatus.data.length; i++) {
                const { zone, region } = zoneStatus.data[i]
                const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
                data += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
            }
            const text = `*CEK LOKASI PENYEBARAN COVID-19*\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${data}`
            cahyo.sendText(from, text)
            break
        case 'wallhp':
            cahyo.sendFileFromUrl(from, 'https://source.unsplash.com/1080x1920/?nature','wp.jpeg', '_*Processing Sukses #HikariPoi BOT*_')
            break
        case 'act':
             arg = body.trim().split(' ')
             if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
             if (arg[1] == 'welcome') {
                wel.push(chat.id)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(wel))
                cahyo.reply(from, `Welcome is now registered on *${name}*`, message.id)
             } else if (arg[1] == 'nsfw') {
                nsfwgrp.push(chat.id)
                fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfwgrp))
                cahyo.reply(from, `NSFW is now registered on *${name}*`, message.id)
             }
        case 'deact':
             arg = body.trim().split(' ')
             if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
             if (arg[1] == 'welcome') {
                let inx = ban.indexOf(from)
                wel.splice(inx, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(wel))
                cahyo.reply(from, `Welcome is now unregistered on *${name}*`, message.id)
             } else if (arg[1] == 'nsfw') {
                let inx = ban.indexOf(from)
                nsfwgrp.splice(inx, 1)
                fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfwgrp))
                cahyo.reply(from, `NSFW is now unregistered on *${name}*`, message.id)
             }
             break
        case 'kickall':
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if (!isGroupMsg) return cahyo.reply(from, 'This command can only be used in groups', message.id)
            if(!isBotGroupAdmins) return cahyo.reply(from, 'You need to make me admin before doing so, Baka!', message.id)
            const allMem = await cahyo.getGroupMembers(from)
            console.log(isGroupAdmins)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) return
                await cahyo.removeParticipant(groupId, allMem[i].id)
            }
            cahyo.reply(from, 'Done!', message.id)
            break
        case 'clearall':
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            const allChatz = await cahyo.getAllChats()
            for (let dchat of allChatz) {
                await cahyo.deleteChat(dchat.id)
            }
            cahyo.reply(from, 'Done', message.id)
            break
        case 'block':
            if(!isGroupMsg) return cahyo.reply(from, '...', message.id)
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if(mentionedJidList.length === 0) return cahyo.reply(from, 'Wrong format', message.id)
            await cahyo.sendText(from, `Request Accepted! issued:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                await cahyo.contactBlock(mentionedJidList[i]).then(() => cahyo.sendText(from, 'Mampus gua block', id))
            }
            break
        case 'unblock':
            if(!isGroupMsg) return cahyo.reply(from, '...', message.id)
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if(mentionedJidList.length === 0) return cahyo.reply(from, 'Wrong format', message.id)
            await cahyo.sendText(from, `Request Accepted! issued:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                await cahyo.contactUnblock(mentionedJidList[i]).then(() => cahyo.sendText(from, 'udah gua buka bloknya', id))
            }
            break
        case 'kick':
            if(!isGroupMsg) return cahyo.reply(from, '...', message.id)
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if(!isBotGroupAdmins) return cahyo.reply(from, 'You need to make me admin to use this CMD', message.id)
            if(mentionedJidList.length === 0) return cahyo.reply(from, 'Wrong format', message.id)
            await cahyo.sendText(from, `Request Accepted! issued:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await cahyo.reply(from, '....', message.id)
                await cahyo.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'delete':
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if (!quotedMsg) return cahyo.reply(from, 'Wrong Format!', id)
            if (!quotedMsgObj.fromMe) return cahyo.reply(from, 'Wrong Format!', id)
            cahyo.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case 'leave':
            if(!isGroupMsg) return cahyo.reply(from, '...', message.id)
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            await cahyo.sendText(from,'Sayonara').then(() => cahyo.leaveGroup(groupId))
            break
        case 'added':
            if(!isGroupMsg) return cahyo.reply(from, '.', message.id)
            if(args.length == 0) return cahyo.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!add* 628xxxxx', message.id)
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if(!isBotGroupAdmins) return cahyo.reply(from, 'You need to make me admin to use this CMD', message.id)
            try {
                await cahyo.addParticipant(from,`${body.slice(5)}@c.us`)
            } catch {
                cahyo.reply(from, `Tidak dapat menambahkan ${body.slice(5)} mungkin karena di private`, message.id)
            }
            break
                    case 'banchat on':
                        if(setting.banChats === true) return
                        if (!isOwner) return await cahyo.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                        setting.banChats = true
                        banChats = true
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                        reply('Global chat has been disabled!')
                        break
                    case 'banchat off':
                        if(setting.banChats === false) return
                        if (!isOwner) return await cahyo.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                        setting.banChats = false
                        banChats = false
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                        reply('Global chat has been enabled!')
                        break
        case 'promote':
            if(!isGroupMsg) return cahyo.reply(from, '.', message.id)
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if(!isBotGroupAdmins) return cahyo.reply(from, 'You need to make me admin to use this CMD', message.id)
            if (mentionedJidList.length === 0) return await cahyo.reply(from, 'Wrong format!', message.id)
            if (mentionedJidList.length >= 2) return await cahyo.reply(from, 'One user at a time', message.id)
            if (groupAdmins.includes(mentionedJidList[0])) return await cahyo.reply(from, 'This user is already admin', message.id)
            await cahyo.promoteParticipant(groupId, mentionedJidList[0])
            await cahyo.sendTextWithMentions(from, `@${mentionedJidList[0].replace('@c.us', '')} is now an admin`)
            break
        case 'demote':
            if(!isOwner) return cahyo.reply(from, 'Baka!, Only Bot owner can use this CMD', message.id)
            if(!isBotGroupAdmins) return cahyo.reply(from, 'You need to make me admin to use this CMD', message.id)
            if (mentionedJidList.length === 0) return cahyo.reply(from, 'Wrong Format', message.id)
            if (mentionedJidList.length >= 2) return await cahyo.reply(from, 'One user at a time', message.id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await cahyo.reply(from, 'The user isn\'t an admin', message.id)
            await cahyo.demoteParticipant(groupId, mentionedJidList[0])
            await cahyo.sendTextWithMentions(from, `Demoted @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        case 'join':
            //return cahyo.reply(from, 'Jika ingin meng-invite bot ke group anda, silahkan izin ke wa.me/6285892766102', id)
            if (args.length < 2) return cahyo.reply(from, 'Kirim perintah *!join linkgroup key*\n\nEx:\n!join https://chat.whatsapp.com/blablablablablabla abcde\nuntuk key kamu bisa mendapatkannya hanya dengan donasi 5k', id)
            const link = args[1]
            const key = args[2]
            const tGr = await cahyo.getAllGroups()
            const minMem = 30
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            if (key !== 'lGjYt4zA5SQlTDx9z9Ca') return cahyo.reply(from, '*key* salah! silahkan chat owner bot unruk mendapatkan key yang valid', id)
            const check = await cahyo.inviteInfo(link)
            if (!isLink) return cahyo.reply(from, 'Ini link? 👊🤬', id)
            if (tGr.length > 15) return cahyo.reply(from, 'Maaf jumlah group sudah maksimal!', id)
            if (check.size < minMem) return cahyo.reply(from, 'Member group tidak melebihi 30, bot tidak bisa masuk', id)
            if (check.status === 200) {
                await cahyo.joinGroupViaLink(link).then(() => cahyo.reply(from, 'Bot akan segera masuk!'))
            } else {
                cahyo.reply(from, 'Link group tidak valid!', id)
            }
            break
        case 'groupinfo' :
            if (!isGroupMsg) return cahyo.reply(from, '.', message.id) 
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = wel.includes(chat.id)
            var ngrp = nsfwgrp.includes(chat.id)
            var grouppic = await cahyo.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await cahyo.sendFileFromUrl(from, pfp, 'group.png', `*${groupname}* 

🌐️ *Members: ${totalMem}*

💌️ *Welcome: ${welgrp}*

⚜️ *NSFW: ${ngrp}*

📃️ *Group Description* 

${desc}`)
        break
        case 'sauce':
            if (isMedia) {
            const mediaData = await decryptMedia(message)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
             try {
                const raw = await fetch("https://trace.moe/api/search", {
                method: "POST",
                body: JSON.stringify({ image: imageBase64 }),
                headers: { "Content-Type": "application/json" }
                })
                const parsedResult = await raw.json()
                const { anime, episode, title_english } = parsedResult.docs[0]
                const content = `*Anime Found!* \n⛩️ *Japanese Title:* ${anime} \n✨️ *English Title:* ${title_english} \n💚️ *Source Episode:* ${episode} `
                await cahyo.sendImage(from, imageBase64, 'sauce.png', content, id)
                console.log("Sent!")
             } catch (err) {
                await cahyo.sendFileFromUrl(from, errorurl, 'error.png', '💔️ An Error Occured', id)
             }
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                try {
                 const raw = await fetch("https://trace.moe/api/search", {
                 method: "POST",
                 body: JSON.stringify({ image: imageBase64 }),
                 headers: { "Content-Type": "application/json" }
                 })
                 const parsedResult = await raw.json()
                 const { anime, episode, title_english } = parsedResult.docs[0]
                 const content = `*Anime Found!* \n⛩️ *Japanese Title:* ${anime} \n✨️ *English Title: ${title_english} \n💚️ *Source Episode:* ${episode} `
                 await cahyo.sendImage(from, imageBase64, 'sauce.png', content, id)
                 console.log("Sent!")
               } catch (err) {
                 throw new Error(err.message)
                 await cahyo.sendFileFromUrl(from, errorurl, 'error.png', '💔️ An Error Occured', id)
               }
            }
            break
        case 'sr':
             arg = body.trim().split(' ')
             const sr = arg[1]
             try {
             const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + sr + '/');
             const {
                    postLink,
                    title,
                    subreddit,
                    url,
                    nsfw,
                    spoiler
                } = response1.data



                if (nsfw == true) {
                      if ((isGroupMsg) && (isnsfw)) {
                                await cahyo.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
                      } else if ((isGroupMsg) && (!isnsfw)) {
                                await cahyo.reply(from, `NSFW is not registered on *${name}*`, id)
                      }
                } else { 
                      await cahyo.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
                }
                } catch(err) {
                    await cahyo.reply(from, 'There is no such subreddit, Baka!', id) 
                }
                break
        case 'cgc':
            arg = body.trim().split(' ')
            const gcname = arg[1]
            cahyo.createGroup(gcname, mentionedJidList)
            cahyo.sendText(from, 'Group Created ✨️')
            break
        /*case 'lyrics':
        case 'lirik':
            if (args.length == 0) return cahyo.reply(from, 'Wrong Format', message.id)
            const lagu = body.slice(7)
            console.log(lagu)
            const lirik = await liriklagu(lagu)
            cahyo.sendText(from, lirik)
            break*/
        case 'slap':
            arg = body.trim().split(' ')
            const person = author.replace('@c.us', '')
            await cahyo.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif','https://media.giphy.com/media/uqSU9IEYEKAbS/source.gif','https://media.giphy.com/media/vxvNnIYFcYqEE/source.gif','https://media.giphy.com/media/3XlEk2RxPS1m8/source.gif','https://media.giphy.com/media/srD8JByP9u3zW/source.gif','https://media.giphy.com/media/Hz3YLyGYc15Oo/sorce.gif','https://media.giphy.com/media/Hj9ixvpSfqcQo/source.gif')
            cahyo.sendTextWithMentions(from, '@' + person + ' *slapped* ' + arg[1])
            break
        case 'botstat':
        case 'botstatus':
        case 'stat':
            const loadedMsg = await cahyo.getAmountOfLoadedMessages()
            const chatIds = await cahyo.getAllChatIds()
            const groups = await cahyo.getAllGroups()
            const battery = await cahyo.getBatteryLevel()
            const charge = await cahyo.getIsPlugged()
            cahyo.sendText(from, `Status :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${charge}* Status Charge\n- *${battery}%* Battrey\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats`)
            break
                    case 'lang':
                        try {
                            let lang = args[1];
                            let langText = body.slice(6+lang.length);
                            if(!lang || !langText) return
                            if(langText.length >= 250) return cahyo.sendText(from,'Teks Kepanjangan :(')
                            var gtts = new gTTs(langText, lang);
                            gtts.save('./gtts/lang.mp3', function () {
                                cahyo.sendPtt(from, './gtts/lang.mp3')
                            })                           
                        } catch (error) {
                            cahyo.sendText(from,`[ERROR] Teks tidak ada, atau kode bahasa ${args[1]} tidak support\n~> *${prefix}bahasa* untuk melihat list kode bahasa`);
                        }
                        
                        break
        case 'anime':
            const keyword = message.body.replace('!anime', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await cahyo.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime', id)
              return null
              }
            const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
            const content = `*Anime Found!*
✨️ *Title:* ${title}

🎆️ *Episodes:* ${episodes}

💌️ *Rating:* ${rated}

❤️ *Score:* ${score}

💚️ *Synopsis:* ${synopsis}

🌐️ *URL*: ${url}`

            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            cahyo.sendImage(from, base64, title, content)
           } catch (err) {
             console.error(err.message)
             await cahyo.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime')
           }
          break
        case 'wallpaper':
        cahyo.sendFileFromUrl(from, 'https://source.unsplash.com/1280x720/?nature','wp.jpeg', '_*Processing Sukses #HikariPoi BOT*_').catch(err => console.log('[ERROR] send image'))
        break
                    case 'qnime':
                        if(args[1]){
                            if(args[1] === 'anime'){
                                const anime = body.slice(13)
                                axios.get('https://animechanapi.xyz/api/quotes?anime='+anime).then(({ data }) => {
                                    let quote = data.data[0].quote 
                                    let char = data.data[0].character
                                    let anime = data.data[0].anime
                                    cahyo.sendText(from, `"${quote}"\n\n${char} from ${anime}`)
                                }).catch(err => {
                                    cahyo.sendText('Quote Char/Anime tidak ditemukan!')
                                })
                            }else{
                                const char = body.slice(12)
                                axios.get('https://animechanapi.xyz/api/quotes?char='+char).then(({ data }) => {
                                    let quote = data.data[0].quote 
                                    let char = data.data[0].character
                                    let anime = data.data[0].anime
                                    cahyo.sendText(from, `"${quote}"\n\n${char} from ${anime}`)
                                }).catch(err => {
                                    cahyo.sendText('Quote Char/Anime tidak ditemukan!')
                                })
                            }
                        }else{
                            axios.get('https://animechanapi.xyz/api/quotes/random').then(({ data }) => {
                                let quote = data.data[0].quote 
                                let char = data.data[0].character
                                let anime = data.data[0].anime
                                cahyo.sendText(from, `"${quote}"\n\n${char} from ${anime}`)
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    break
    case 'quran':
        axios.get('https://api.banghasan.com/quran/format/json/acak').then((res) => {
        const sr = /{(.*?)}/gi;
        const hs = res.data.acak.id.ayat;
        const ket = `${hs}`.replace(sr, '');
        let hasil = `*[ ${ket} ]*   ${res.data.acak.ar.teks}\n\n${res.data.acak.id.teks}(QS.${res.data.surat.nama}, Ayat ${ket})\n\n_*Processing Sukses #HikariPoi BOT*_`;
            cahyo.sendText(from, hasil);
                })
        break
        case 'animeneko':
            cahyo.sendFileFromUrl(from, akaneko.neko(), 'neko.jpg', 'Neko *Nyaa*~')
            break
        case 'ss':
            const _query = body.slice(8)
            if (args.length === 1) return cahyo.reply(from, 'Kirim perintah *!ss [web]*\nContoh *!ss https://google.com*', id)
            await ss(_query).then(() => cahyo.sendFile(from, './media/img/screenshot.jpeg', 'ss.jpeg', '', id))
            .catch(() => cahyo.reply(from, `Error tidak dapat mengambil screenshot website ${_query}`, id))
            break
        case 'listblock':
            let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            cahyo.sendTextWithMentions(from, hih, id)
            break
        case 'adminlist':
            if (!isGroupMsg) return cahyo.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await sleep(2000)
            await cahyo.sendTextWithMentions(from, mimin)
            break
        case 'getses':
        case 'ses':
            const sesPic = await cahyo.getSnapshot()
            cahyo.sendFile(from, sesPic, 'session.png', 'Neh...', id)
            break
        case 'doggo':
        case 'anjing':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            cahyo.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Doggo ✨️', id)
            break
        case 'neko':
        case 'kucing':          
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            cahyo.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko 🌠️', id)
            break
        case 'roll':
            const dice = Math.floor(Math.random() * 6) + 1
            await cahyo.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png')
            break
        case 'flip':
            const side = Math.floor(Math.random() * 2) + 1
            if (side == 1) {
               cahyo.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
            } else {
               cahyo.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
            }
            break
        case 'ship':
            arg = body.trim().split(' ')
            const per = Math.floor(Math.random() * 100)

if (per < 25) { 
var sentence = `${per}% Worse than average ♦️`
} else if (per < 50) {
var sentence = `${per}% I don't know how i feel about it ❇️` 
} else if (per < 75) {
var sentence = `${per}% Good, I guess... ⭐️` 
} else if (per < 90) {
var sentence = `${per}% Sugoii! Go for it!🤩️` 
} else {
var sentence = `${per}% Incredible! You two will be an amazing couple 😍️` 
}

var shiptext = `❣️ *Matchmaking...*

---------------------------------
    *${arg[1]}  x  ${arg[2]}*
---------------------------------

${sentence}`
        await cahyo.sendTextWithMentions(from, shiptext)
        break
        case 'pokemon':
            q7 = Math.floor(Math.random() * 890) + 1;
            cahyo.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png','.', id)
            break
        case 'rpaper' :
            const walnime = ['https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            cahyo.sendFileFromUrl(from, walnimek, 'Nimek.jpg', '', message.id)
            break
        case 'meme':
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
            const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
            await cahyo.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break
        case 'help':
		case 'menu':
            cahyo.reply(from, help.replace(undefined, pushname), message.id)
            break
        /*case 'bahasa':
            cahyo.sendText(from,bahasa)
            break*/
        case 'index':
            cahyo.sendFile(from, './index.js','index.js')
            break
        case 'bahasa':
            cahyo.sendText(from, bahasa)
            break
        case 'sendsticker':
            cahyo.sendFile(from, './lib/sendSticker.js','sendSticker.js')
            break
        case 'handler':
            cahyo.sendFile(from, './msgHandler.js','msgHandler.js')
            break
        case 'functions':
            cahyo.sendFile(from, './lib/functions.js','functions.js')
            break
        /*case 'info':
            cahyo.sendLinkWithAutoPreview(from, 'https://github.com/SomnathDas/whatsapp-botto-re', info)
            break*/
        case 'profile':
            var role = 'Member Gratis'
              if(isOwner){role = 'President'}
              if(isGroupAdmins){role = 'Vice President'}
              if (isGroupMsg) {
              if (!quotedMsg) {
              var block = ban.includes(author)
              var pic = await cahyo.getProfilePicFromServer(author)
              var namae = pushname
              var sts = await cahyo.getStatus(author)
              var adm = isGroupAdmins
              const { status } = sts
               if (pic == undefined) {
               var pfp = errorurl 
               } else {
               var pfp = pic
               } 
             await cahyo.sendFileFromUrl(from, pfp, 'pfp.jpg', `🔖️ *Username: ${namae}*\n\n💌️ *User Info: ${status}*\n\n*💔️ Ban: ${block}*\n\n✨️ *Role: ${role}*\n\n👑️ *Admin: ${adm}*`)
             } else if (quotedMsg) {
             var qmid = quotedMsgObj.sender.id
             var block = ban.includes(qmid)
             var pic = await cahyo.getProfilePicFromServer(qmid)
             var namae = quotedMsgObj.sender.formattedName
             var sts = await cahyo.getStatus(qmid)
             var admgrp = await cahyo.getGroupAdmins(from)
             var adm = admgrp.includes(qmid)
             const { status } = sts
              if (pic == undefined) {
              var pfp = errorurl 
              } else {
              var pfp = pic
              } 
             await cahyo.sendFileFromUrl(from, pfp, 'pfo.jpg', `🔖️ *Username: ${namae}*\n\n💌️ *User Info: ${status}*\n\n*💔️ Ban: ${block}*\n\n✨️ *Role: ${role}*\n\n👑️ *Admin: ${adm}*`)
             }
            }
            break
        case 'snk':
            cahyo.reply(from, snk, message.id)
        default:
            await cahyo.reply(from, `Don't use unlisted commands, Baka!`, id)
            console.log(color('[UNLISTED]', 'red'), color(time, 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }
    }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
