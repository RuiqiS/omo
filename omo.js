require('dotenv').config()
const Discord = require('discord.js')
    ,client = new Discord.Client({
        disableEveryone: true,
        disabledEvents: ['TYPING_START']
    })
    ,prefix = process.env.PREFIX
    ,path = require('path')
    ,{ createCanvas, registerFont } = require('canvas')
    ,pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'.split('');
registerFont(path.join(__dirname, 'captcha', 'Captcha.ttf'), { family: 'Captcha' });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setActivity('in the kitchen')
    client.user.setStatus('dnd')
})

client.on('error', e => {
    console.error(e)
});

client.on('guildMemberAdd', member => {
    const memberchannel = member.guild.channels.get(process.env.MEMBERLOG_CHANNEL)
        ,countchannel = member.guild.channels.get(process.env.COUNTCHANNEL)
    if (!memberchannel) return;

    const addmemberdata = [];
    addmemberdata.push(`<:useradd:531579355009384468> | __**User joined**__`)
    addmemberdata.push(`\`Tag:\` ${member.user.tag} || \`ID:\` ${member.user.id}`)
    addmemberdata.push(`\`Account Created:\` ${member.user.createdAt}`)
    memberchannel.send(addmemberdata, { split: true })
    member.send(`Welcome to **${member.guild.name}**, ${member.user.username}! Please read <#531568914400935956> and use \`omo!verify\` in <#531586476832587787> to begin!`)
    countchannel.setName(`User Count: ${member.guild.memberCount}`)
})

client.on('guildMemberRemove', member => {
    const memberchannel = member.guild.channels.get(process.env.MEMBERLOG_CHANNEL)
        ,countchannel = member.guild.channels.get(process.env.COUNTCHANNEL)
    if (!memberchannel) return;

    const remmemberdata = [];
    remmemberdata.push(`<:userrem:531579355026161674> | __**User left**__`)
    remmemberdata.push(`\`Tag:\` ${member.user.tag} || \`ID:\` ${member.user.id}`)
    remmemberdata.push(`\`Joined At:\` ${member.joinedAt}`)
    memberchannel.send(remmemberdata, { split: true })
    countchannel.setName(`User Count: ${member.guild.memberCount}`)
})

client.on('message', async msg => {
    if (msg.content.startsWith('<a:') && msg.author.id === '303181446481444864') {
        msg.delete()
        msg.channel.send('<@303181446481444864>, No animated emotes. Because you\'re Simiao')
            .then(m => m.delete(10000))
    }
    if (msg.content.startsWith('https://discord.gg') && msg.channel.name !== 'self-promotion' || msg.content.startsWith('http://discordapp.com/invite') && msg.channel.name !== 'self-promotion' || msg.content.startsWith('http://discord.gg') && msg.channel.name !== 'self-promotion' || msg.content.startsWith('https://discordapp.com/invite') && msg.channel.name !== 'self-promotion') {
        msg.delete()
        msg.channel.send(`⛔ || <@!${msg.author.id}>, **Please refrain from posting invites!** That's what <#531600766687772692> is for!!`)
    }
    if (!msg.content.startsWith(prefix) || msg.author.bot || msg.channel.type === 'dm') return;
    const args = msg.content.slice(prefix.length).split(' ')
        ,command = args.shift().toLowerCase();
    if (command === 'verify' && msg.channel.id === process.env.VERIFYCHANNEL) {
        msg.delete()
        const canvas = createCanvas(125, 32);
		const ctx = canvas.getContext('2d');
        const text = randomText(5);
        const Humanrole = msg.guild.roles.find("name", "Users")
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.strokeStyle = '#0088cc';
		ctx.font = '26px Captcha';
		ctx.rotate(-0.05);
		ctx.strokeText(text, 15, 26);
		await msg.channel.send(
			`**${msg.author.username}, You have 15 seconds, what does the captcha say?**`,
			{ files: [{ attachment: canvas.toBuffer(), name: 'captcha-quiz.png' }] }
		);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 30000
		});
		if (!msgs.size) return msg.channel.send(`Sorry, time is up! It was ${text}.`);
		if (msgs.first().content !== text) return msg.reply(`Nope, sorry, it's ${text}. Use \`omo!verify\` again to try again, or ping a staff to manually give you the role`);
        return msg.channel.send(`Verification for ${msg.author.username} Successful`)
            .then(msg.member.addRole(Humanrole))

        function randomText(len) {
            const result = [];
            for (let i = 0; i < len; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
            return result.join('');
        }
    }
    if (command === 'ping') {
        let start = Date.now(); msg.channel.send('Pinging...').then(msg => {
            let diff = (Date.now() - start)
                ,API = (client.ping).toFixed(2)
                ,embed = new Discord.RichEmbed()
                    .setTitle(`🏓 Pong!`)
                    .setColor(0xff2f2f)
                    .addField("📶 Latency", `${diff}ms`, true)
                    .addField("💻 API", `${API}ms`, true)
                msg.edit(embed);
        });
    } else if (command === 'kick') {
        if (!msg.member.hasPermission('KICK_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`KICK_MEMBERS\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to kick!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,embed1 = new Discord.RichEmbed()
                    .setColor('FF0000')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Kick || ${user.user.tag}`)
                    .setDescription(`ID: ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                user.kick(reason)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed1))
        }
    } else if (command === 'ban') {
        if (!msg.member.hasPermission('BAN_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`BAN_MEMBERS\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to ban!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,embed2 = new Discord.RichEmbed()
                    .setColor('FF0000')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Ban || ${user.user.tag}`)
                    .setDescription(`ID: ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                user.ban(reason)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed2))
        }
    } else if (command === 'mute') {
        if (!msg.member.hasPermission('MANAGE_ROLES')) {
            return msg.channel.send('You\'re missing permissions: \`MANAGE_ROLES\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to mute!')
        } else {
            const user = msg.mentions.members.first()
                ,time = args[1]
                ,reason = args.slice(msg.mentions.members.first.length + time.length).join(' ')
                ,muterole = msg.guild.roles.find('name', 'Muted')
                ,embed3 = new Discord.RichEmbed()
                    .setColor('CCCC00')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Mute || ${user.user.tag}`)
                    .setDescription(`Time: ${time} seconds`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                ,embed4 = new Discord.RichEmbed()
                    .setColor('00FFFF')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Unmute || ${user.user.tag}`)
                    .setDescription(`ID: ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', 'Time up')
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                if (isNaN(time) || !time) {
                    return msg.channel.send(`Correct usage: \`${prefix}mute <user> <time(seconds)> [reason]\``);
                }
                user.addRole(muterole, `Requested by ${msg.author.tag}`)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed3))
                setTimeout(() => {user.removeRole(muterole, 'Mute time up') && client.channels.get(process.env.MODLOG_CHANNEL).send(embed4)}, time * 1000)
        }
    } else if (command === 'unmute') {
        if (!msg.member.hasPermission('MANAGE_ROLES')) {
            return msg.channel.send('You\'re missing permissions: \`MANAGE_ROLES\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to unmute!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,muterole = msg.guild.roles.find('name', 'Muted')
                ,embed5 = new Discord.RichEmbed()
                    .setColor('00FFFF')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Unmute || ${user.user.tag}`)
                    .setDescription(`ID ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                user.removeRole(muterole, `Requested by ${msg.author.tag}`)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed5))
            }
    } else if (command === 'purge') {
        const deleteCount = parseInt(args[0], 10)
        if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
            return msg.channel.send('The number must be inbetween 2 and 100')
        }
        const fetched = await msg.channel.fetchMessages({ limit: deleteCount });
        msg.channel.bulkDelete(fetched)
            .catch(e => msg.channel.send(`Could not delete messages || Error: \`${e}\``))
    }
})

client.login(process.env.TOKEN)
