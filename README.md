# oMo
Meet omo! Omo is a discord moderation bot that was created to server it's purpose in our [home server](https://discord.gg/wjbHAYG)
This bot literally consists of one file, however, it comes with many moderation features
> Unfortunately, you cannot invite omo to your own servers; however, you *can* clone this repository or use parts of this code in your own bot

## Installation
### Prerequisites
Make sure you have [node.js >= v6.0.0](http://nodejs.org) and [git](https://git-scm.com/) installed

### Steps
1. Clone this repository using `git clone https://github.com/RuiqiS/omo.git`
3. Run `npm init` and follow the walkthrough steps to make a package.json file
3. Run `npm install` in the project folder
4. Make a .env file; format demonstrated below
5. Run `npm install pm2` to install PM2
6. To start up the bot, run `npm start omo.js`. The bot will continue to remain online until your computer shuts down or you get disconnected from the Internet

****MAKE SURE YOU GIVE THE BOT THE FOLLOWING PERMISSIONS:
* BAN_MEMBERS
* KICK_MEMBERS
* MANAGE_ROLES
* EMBED_LINKS
* DEAFEN_MEMBERS
* MUTE_MEMBERS
* MANAGE_MESSAGES

(Ignore the Procfile)

### .env
```
TOKEN=tokenwithoutquotationmarksspacesoranything
EMBED_IMAGE=imagelinkforembeds
MOGLOG_CHANNEL=modlogchannelid
PREFIX=botprefix
```

### I just want to see how it works!
You can join our [home server](https://discord.gg/wjbHAYG) and watch @omo#8447

If you find out about an issue with the bot, or need help setting it up, feel free to start an issue or pull request