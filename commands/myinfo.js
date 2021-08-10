module.exports = {
	name: 'myinfo',
	aliases: ['ID'],
	description: 'get the name and ID from a player',
	execute(client, message, args) {
		message.channel.send(`Your Username: ${message.author.username}\n Your ID: ${message.author.id }`);
	}
};
