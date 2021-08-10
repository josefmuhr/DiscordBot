const Discord = require("discord.js");

class SaufenListener {
    constructor(client) {
        this.client = client;
    }

    handle (message) {
        if (!this.client.saufenService.active || message.channel.id != this.client.saufenService.channel) {
            return
        }
        const content = message.content;
        if (content === 'next') {
            // message.channel.send(this.client.saufenService.getRandomAction());
            message.channel.send(new Discord.MessageEmbed()
                .setDescription(this.client.saufenService.getRandomAction())
                .setColor(0x424242))
        } else if (content === 'cancel') {
            this.client.saufenService.stop();
            message.channel.send('saufen-Mode is OFF // Seid ihr schon zu fertig oder was?')
        }
    }
}

module.exports = SaufenListener;
