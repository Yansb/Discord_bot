import dotenv from 'dotenv'
import {Client, WebhookClient} from "discord.js";

dotenv.config()

const PREFIX = '$';
const client = new Client({
  partials: ['MESSAGE', 'REACTION']
});

client.on("ready", () => {
  console.log('🔌️ bot conectado'); 
})

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN,
);

client.on("message", async (message)=>{
  if(!message.author.bot){
    if(message.content.startsWith(PREFIX)){
      const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/)

      console.log(CMD_NAME)
      console.log(args)

      if(CMD_NAME === 'kick'){
        if(!message.member?.hasPermission('KICK_MEMBERS')){
          return message.reply('You dont have permissions to use that command')
        }

        const user = message.mentions.users.first();

        if(!user){
          return message.reply("por favor marque um usuario")
        }
                
        const member = message.guild?.member(user)

        if(member){
          member
            .kick()
            .then((member)=> message.channel.send(`${user.tag} was kicked`))
            .catch((err)=> message.channel.send('I do not have permissions to kick that user')) 
        }

      }else if(CMD_NAME === 'ban'){
        if(!message.member?.hasPermission('BAN_MEMBERS')){
          return message.reply('You dont have permissions to use that command')
        }
        
        if(args.length === 0){
          return message.reply("por favor coloque um ID")
        }
        try{
          const user = await message.guild?.members.ban(args[0])
          message.channel.send('User was banned successfully');
        }catch(err){
          console.log(err);
          message.channel.send('Something gone wrong')
        }
          
      }else if(CMD_NAME === 'announce'){
        const msg = args.join(' ')
        webhookClient.send(msg);
      }
    }
  }
})

client.on("messageReactionAdd", (reaction, user)=>{
  const {name} = reaction.emoji

  const member = reaction.message.guild?.members.cache.get(user.id)

  if(reaction.message.id === '797480674897428512'){
    switch(name){
      case "typescript":
        member?.roles.add("797480195384672296")
        break;
      case "python":
        member?.roles.add("797480232324038686")
        break;
      case "🇨":
        member?.roles.add("797480291894951956")
        break;
      case "java":
        member?.roles.add("797480257410170961")
        break;
    }

  }
});

client.on("messageReactionRemove", (reaction, user)=>{
  const {name} = reaction.emoji

  const member = reaction.message.guild?.members.cache.get(user.id)

  if(reaction.message.id === '797480674897428512'){
    switch(name){
      case "typescript":
        member?.roles.remove("797480195384672296")
        break;
      case "python":
        member?.roles.remove("797480232324038686")
        break;
      case "🇨":
        member?.roles.remove("797480291894951956")
        break;
      case "java":
        member?.roles.remove("797480257410170961")
        break;
    }

  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
