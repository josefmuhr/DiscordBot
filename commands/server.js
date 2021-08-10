module.exports = {
	name: 'server',
	aliases: ['online'],
	cooldown: 5,
	description: 'Make the server tell the totalAmount of Members online',
	execute(client, message, args) {
        const guild = client.guilds.cache.get('403210967179329547')
		guild.members.fetch().then(fetchedMembers => {
            const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online')
			message.channel.send(`${totalOnline.size} people are online.`)
		}).catch(error => {
			message.channel.send(error.message)
		})
	}
}
