const { Client, GatewayIntentBits} = require("discord.js");


const client = new Client({ intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});

const axios = require("axios")
const config = require("./config.json")
let messageid = null

async function getserverinfo(){
    try{
        const response = await axios.get('http://127.0.0.1:30120/players.json');
        const players = response.data.length;
        return players;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

async function updatemessage(channel){
  
     setInterval(async() => {
    
    const playersonline = await getserverinfo();
    const messagecontent = playersonline !== null ? `** Fivem Server IP ** : 127.0.0.1:30120 \n **Players Online: ${playersonline} **` : 'Unable to fetch data';

    if (messageid) {

        const message = await channel.messages.fetch(messageid);
        await message.edit(messagecontent);
    }
     else {
        const sentmessage = await channel.send(messagecontent);
        messageid= sentmessage.id
     }


     } , 1000)


}


client.once("ready", () => {
 console.log("ready");

 const channel = client.channels.cache.get(config.channel)

 if (channel){
    updatemessage(channel)
 }
else {
    console.error('No channel provided!')
}

});


client.login(config.token);