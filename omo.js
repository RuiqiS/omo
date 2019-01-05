require('dotenv').config()
const Discord = require('discord.js')
    ,client = new Discord.Client({
        disableEveryone: true,
        disabledEvents: ['TYPING_START']
    })
    ,prefix = process.env.PREFIX;

client.on('error', e => {
    console.error(e)
});

client.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot || msg.channel.type === 'dm') return;
    const args = msg.content.slice(prefix.length).split(' ')
        ,command = args.shift().toLowerCase();
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
                ,embed = new Discord.RichEmbed()
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
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
        }
    } else if (command === 'ban') {
        if (!msg.member.hasPermission('BAN_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`BAN_MEMBERS\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to ban!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,embed = new Discord.RichEmbed()
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
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
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
                ,embed = new Discord.RichEmbed()
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
                ,embed1 = new Discord.RichEmbed()
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
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
                setTimeout(() => {user.removeRole(muterole, 'Mute time up') && client.channels.get(process.env.MODLOG_CHANNEL).send(embed1)}, time * 1000)
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
                ,embed = new Discord.RichEmbed()
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
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
            }
    } else if (command === 'softban') {
        if (!msg.member.hasPermission('BAN_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`BAN_MEMBERS\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to softban!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,embed = new Discord.RichEmbed()
                    .setColor('000000')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Softban || ${user.user.tag}`)
                    .setDescription(`ID ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                user.ban(`Requested by: ${msg.author.tag}`, 7)
                .then(msg.guild.unban(user.user.id, reason))
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
            }
    } else if (command === 'unban') {
        if (!msg.member.hasPermission('BAN_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`BAN_MEMBERS\`')
        } else if (!msg.mentions.users.size) {
            return msg.channel.send('⛔ || Please mention a user to unban! (Using \`<@insertuseridhere>\`)')
        } else {
            const user = msg.mentions.users.first()
                ,reason = args.slice(msg.mentions.users.first.length).join(' ')
                ,embed = new Discord.RichEmbed()
                    .setColor('00FF00')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Unban || ${user.user.tag}`)
                    .setDescription(`ID ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                msg.guild.unban(user.user.id, reason)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
            }
    } else if (command === 'tempban') {
        if (!msg.member.hasPermission('BAN_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`BAN_MEMBERS\`')
        } else if (!msg.mentions.users.size) {
            return msg.channel.send('⛔ || Please mention a user to tempban!')
        } else {
            const user = msg.mentions.users.first()
                ,reason = args.slice(msg.mentions.users.first.length).join(' ')
                ,embed = new Discord.RichEmbed()
                    .setColor('CC6600')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Tempban || ${user.user.tag}`)
                    .setDescription(`ID ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                ,embed = new Discord.RichEmbed()
                    .setColor('00FF00')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`Unban || ${user.user.tag}`)
                    .setDescription(`ID: ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', 'Time up')
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                if (isNaN(time) || !time) {
                    return msg.channel.send(`Correct usage: \`${prefix}tempban <user> <time(days)> [reason]\``);
                }
                user.ban(reason)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
                setTimeout(() => {msg.guild.unban(user.id, 'Tempban time up') && client.channels.get(process.env.MODLOG_CHANNEL).send(embed1)}, time * 86400000)
            }
    } else if (command === 'deafen') {
        if (!msg.member.hasPermission('DEAFEN_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`DEAFEN_MEMBERS\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to deafen!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,embed = new Discord.RichEmbed()
                    .setColor('FF0000')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`User Deafened || ${user.user.tag}`)
                    .setDescription(`ID: ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                user.setDeaf(true, reason)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
        }
    } else if (command === 'voicemute') {
        if (!msg.member.hasPermission('MUTE_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`MUTE_MEMBERS\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to mute!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,embed = new Discord.RichEmbed()
                    .setColor('FF0000')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`User Voice muted || ${user.user.tag}`)
                    .setDescription(`ID: ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                user.setMute(true, reason)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
        }
    } else if (command === 'undeafen') {
        if (!msg.member.hasPermission('DEAFEN_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`DEAFEN_MEMBERS\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to undeafen!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,embed = new Discord.RichEmbed()
                    .setColor('FF0000')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`User Undeafened || ${user.user.tag}`)
                    .setDescription(`ID: ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                user.setDeaf(false, reason)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
        }
    } else if (command === 'voiceunmute') {
        if (!msg.member.hasPermission('MUTE_MEMBERS')) {
            return msg.channel.send('You\'re missing permissions: \`MUTE_MEMBERS\`')
        } else if (!msg.mentions.members.size) {
            return msg.channel.send('⛔ || Please mention a user to voice unmute!')
        } else {
            const user = msg.mentions.members.first()
                ,reason = args.slice(msg.mentions.members.first.length).join(' ')
                ,embed = new Discord.RichEmbed()
                    .setColor('FF0000')
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle(`User Voice Unmuted || ${user.user.tag}`)
                    .setDescription(`ID: ${user.id}`)
                    .addField('User', `<@${user.id}>`, true)
                    .addField('Staff', `<@${msg.author.id}>`, true)
                    .addField('Reason', `\`${reason || 'No reason provided'}\``)
                    .setImage(process.env.IMAGE)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp()
                user.setDeaf(false, reason)
                .then(client.channels.get(process.env.MODLOG_CHANNEL).send(embed))
        }
    } else if (command === 'purge') {
        const deleteCount = parseInt(args[0], 10)
        if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
            return msg.channel.send('The number must be inbetween 2 and 100')
        }
        const fetched = await msg.channel.fetchMessages({ limit: deleteCount });
        msg.channel.bulkDelete(fetched)
            .catch(e => msg.channel.send(`Could not delete messages || Error: \`${e}\``))
    } else if (command === 'help') {
        const embed = new Discord.RichEmbed()
            .setAuthor('omo - a bot created by <@260594090255712258>', client.user.displayAvatarURL)
            .setColor('FFFFFF')
            .setTitle(`List of Available Commands ~ `)
            .setDescription(`\`Note:\` With the exception of ${prefix}ping, these commands are designed for moderators (They need server permissions to be executed)`)
            .addField(`${prefix}ping`, `Checks the bot\'s latency ping || ${prefix}ping`)
            .addField(`${prefix}purge`, `Deletes a certain amount of messages in the channel || ${prefix} <amount>`)
            .addField(`${prefix}mute`, `Mutes a user temporarily || ${prefix}mute <user> <time(seconds)> [reason]`)
            .addField(`${prefix}unmute`, `Unmutes a user manually (Bypasses time limit) || ${prefix}unmute <@user> [reason]`)
            .addField(`${prefix}voicemute`, `Voice mutes a user || ${prefix}voicemute <user> [reason]`)
            .addField(`${prefix}voiceunmute`, `Voice unmutes a user || ${prefix}voiceunmute <user> [reason]`)
            .addField(`${prefix}deafen`, `Deafens a user || ${prefix}deafen <user> [reason]`)
            .addField(`${prefix}undeafen`, `Undeafens a user || ${prefix}undeafen <user> [reason]`)
            .addField(`${prefix}kick`, `Kicks a user || ${prefix}kick <user> [reason]`)
            .addField(`${prefix}ban`, `Bans a user || ${prefix}ban <user> [reason]`)
            .addField(`${prefix}tempban`, `Bans a user, but only temporarily || ${prefix}tempban <user> <time(days)> [reason]`)
            .addField(`${prefix}softban`, `Softbans a user || ${prefix}softban <user> [reason]`)
            .addField('What is softban?', 'Softban is banning a user, and deleting 7 days worth of messages from that user in the process, then unbanning them')
        msg.channel.send(embed)
    }
})

client.login(process.env.TOKEN).then(
    console.log(`[READY] Logged in as ${client.user.tag}`),
    client.user.setActivity('in the fridge'),
    client.user.setStatus('dnd')
)