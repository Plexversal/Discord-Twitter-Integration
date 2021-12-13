require('dotenv').config();
const fs = require("fs").promises;
const discord = require('discord.js');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"], fetchAllMembers: true, disableEveryone: true});
const config = require('./config.json');
const path = require('path');
const twit = require('twit');

client.commands = new discord.Collection();

const TwitterClient = new twit({
  consumer_key: `${process.env.TWITTER_KEY}`,
  consumer_secret: `${process.env.TWITTER_SECRET}`,
  access_token: `${process.env.TWITTER_TOKEN}`,
  access_token_secret: `${process.env.TWITTER_TOKENSECRET}`,
  timeout_ms: 60 * 1000,
  strictSSL: true
})

// command handler
fs.readdir('./commands/')
    .then(files => {
      
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
      console.log("Unable to find 'commands' file.")
      return;
    }
  
    jsfile.forEach((f, i) => {
      let props = require(`./commands/${f}`);
      console.log(` <FILE> :  ${f} loaded.`)
      client.commands.set(props.help.name, props);
    });
    console.log(`\n---All commands loaded!---\n`)
  }).catch(e => console.log(e));
  
  // event handler
  fs.readdir('./events/').then(files => {
    files.forEach(f => {
      if(!f.endsWith(`.js`)) return;
      const event = require(`./events/${f}`)
      const eventName = f.split(`.`)[0];
      console.log(` <FILE> :  ${f} loaded.`);
      client.on(eventName, event.bind(null, client))
      
    });
    console.log(`\n---All events loaded!---\n`);
  }).catch(e => console.log(e));

  fs.readdir(path.join(__dirname, 'handlers'))
  .then(files => {
    files.filter(f => f === `TwitterStream.js`).forEach(f => {
      let name = f.substring(0, f.indexOf('.js'))
      console.log(name)
      let module = require(path.join(__dirname, 'handlers', name))
  
      console.log(`${name} Handler Loaded.`)
  
      var stream = TwitterClient.stream('statuses/filter', {follow: config.twitter.accounts})
      stream.on('tweet', module.bind(null, client, TwitterClient));
    })
  }).catch(e => console.log(e));

client.login(process.env.DISCORD_TOKEN); 
