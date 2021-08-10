const fs = require('fs')
const path = require('path')

class SaufenService {
    constructor (client) {
        this.client = client;
        this.names = [];
        this.active = false;
        this.replies = [];
        this.channel = null;
    }

    async init () {
        const fileContents = await fs.readFileSync(path.join(process.cwd(), './assets/saufen_replies.json'));
        this.replies = JSON.parse(fileContents);
    }

    start (names) {
        this.names = names;
        this.active = true;
    }

    stop () {
        this.names = [];
        this.active = false;
        this.channel = null;
    }

    add (name) {
        if (this.active) {
            this.names.push(name);
        } else {
            return false;
        }
    }

    setActiveChannel (channel) {
        this.channel = channel;
    }

    getRandomAction () {
        let tempReply = this.getRandomReply();
        let tempCount = tempReply.variableCount;
        while (tempCount > this.names.length) {
            tempReply = this.getRandomReply();
            tempCount = tempReply.variableCount;
        }

        const reply = tempReply;
        const count = tempCount;

        let tempNames = [...this.names];
        const luckyNames = [];
        for (let i = 0; i < count; i++) {
            luckyNames[i] = tempNames[Math.floor(Math.random() * tempNames.length)];
            tempNames = tempNames.filter(tempName => tempName != luckyNames[i]);
        }

        let action = reply.template;
        for (let name of luckyNames) {
            action = action.replace('%s', name);
        }

        return action;
    }

    getRandomReply () {
        return this.replies[Math.floor(Math.random() * this.replies.length)];
    }
}

module.exports = SaufenService;
