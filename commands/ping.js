module.exports = {
	name: 'ping',
	description: 'get the ping from a player',
	execute(client, message, args) {
		message.channel.send(`${client.ws.ping}ms`);
	}
};
