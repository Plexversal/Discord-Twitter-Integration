const startTime = new Date().getTime()
const config = require('../config.json')
const discord = require('discord.js');
const util = require('util')

module.exports = (client, TwitterClient, tweet) => {
    //console.log(tweet);
    console.log(util.inspect(tweet, true, 6, true));

    if(config.twitter.accounts.includes(tweet.user.id_str) && !tweet.retweeted_status) {
      
        let embed = new discord.MessageEmbed()
        .setColor('#0000FF')
        .setDescription(`[**Link**](https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}})`)
        .addFields([
            {name: `Author`, value: `${tweet.user.screen_name}`, inline: false},
            {name: `Content`, value: `${tweet.text}`, inline: false},
            {name: `Time posted`, value: `${tweet.created_at}`, inline: false}
        ])
        .setThumbnail(tweet.profile_image_url_https)
        .setImage(tweet.extended_entities ? tweet.extended_entities.media[0].media_url_https : ``)
        .setTimestamp(tweet.timestamp_ms)
        .setTitle('New Tweet')

        client.channels.fetch(config['channels'][0])
        .then(c => c.send({ embeds: [embed] }))
    }
        /*
        - Here you can either replace the above code, modify the embeds and data.
        - You can put console.log(tweet) to view the tweet object data and what you can output.
        - You can filter tweets you see by modifying the tweet authors in config and such using simple if statements, so play around with it.
        */
      
}