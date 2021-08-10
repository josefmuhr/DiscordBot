const fs = require('fs'); // require standard file system of js
const Discord = require('discord.js'); // require the discordjs module

const SaufenService = require('./services/SaufenService');
const SaufenListener = require('./listeners/SaufenListener');

const config = require('./config.json'); // take the prefix and the token from the config file
// const { prefix, token, apitoken } = require('./config.json'); // take the prefix and the token from the config file
const client = new Discord.Client(); // making a new discord client
client.config = config
client.saufenService = new SaufenService(client);
client.saufenService.init();

client.saufenListener = new SaufenListener(client);

client.commands = new Discord.Collection(); // make a new colletion of data named client.commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // create a array with listings like ['server.js', 'ping.js'] from ./commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command); // make a for loop where every entry gets their name and data stored in the collection client.commands
}

const cooldowns = new Discord.Collection(); // make a collection for cooldowns

client.once('ready', () => {
    console.log('Ready!'); // let the console say ready if client started
});


// starting the event message
client.on('message', function (message) {

    client.saufenListener.handle(message);

    if (!message.content.startsWith(config.prefix) || message.author.bot) return; // if message doesn't start with prefix, return

    const args = message.content.slice(config.prefix.length).trim().split(/ +/); // take the input, slice of the prefix, seperate every word by spaces and put them in an array

    const commandName = args.shift().toLowerCase(); // take the first element from args and put it in lower case

    const command = client.commands.get(commandName) || client.commands.find(function (cmd) {
        return cmd.aliases && cmd.aliases.includes(commandName);
    }); //make 

    if (!command) {
        message.channel.send('You didn\'t provide an argument!')
        return
    } // if the input isn't a known command, then send message and return

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection()); // if the commandname is not yet in the cooldowns collection, add it
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    console.log(timestamps)
    const cooldownAmount = (command.cooldown || 2) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);

        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    command.execute(client, message, args); //execute the function for the right command

});

client.login(config.token); // log in the bot with authentification
