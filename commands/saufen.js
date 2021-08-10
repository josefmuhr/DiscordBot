module.exports = {
    name: 'saufen',
    aliases: ['hacke'],
    description: 'put a random challenge in the chat',
    cooldown: 5,
    execute(client, message, args) {
        if (args[0] === 'add') {
            client.saufenService.add(args[1]);
            return message.channel.send(`${args[1]} sauft jetz mit`)
        }
        if (args[0] === 'list') {
            const names = client.saufenService.names.map(name => ` - ${name}`).join('\n');
            return message.channel.send('```' + names + '```')
        }
        if (args.length === 0) {
            return message.channel.send('Musst schon wen angeben')
        }
        client.saufenService.start(args);
        client.saufenService.setActiveChannel(message.channel.id)
        message.channel.send('saufen-Mode is ON // Aufgehts voigas');
    }
}
