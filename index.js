const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'NDg4NzYzOTg2MTA0NDE4MzA5.XO6zPA.eszwiK2XOhPdBfJgVQf0gbucF3Q';
const config = require("./config.json");
const no_acces = "nu ai acces la aceasta comanda!";

const server_status = {
    total_users_ID: '583548684067930143',
    member_count_ID: '583548684134776862',
    bot_count_ID: '583548828393799705'
}

client.on('ready', () => {
    console.log('Online!');
})

client.on('guildMemberAdd', member => {
    var joinRole = member.guild.roles.find(role => role.name === "Member");
    member.addRole(joinRole);

    let joinChannel = member.guild.channels.find(channel => channel.name === "general");
    joinChannel.send(`**[+]** Alo verutziii! ${member} s-a alaturat acestui grup!`);

    const embed = new Discord.RichEmbed()
        .setAuthor(`Bine ai venit pe serverul San Andreas Universe, ${member.displayName}!`)
        .setDescription('**Iti uram sedere placuta alaturi de noi.\nDaca ai intrebari, ni le poti adresa pe chatul <#general>.\n\nO zi/seara/dimineata placuta :wink:!**')
        .setThumbnail('https://cdn.discordapp.com/icons/285793218023653376/7301f7da88defd2d47f18879fd3b8577.jpg')
        .setColor('#3388d2')
        .setTimestamp()
        .setFooter('joined', 'https://cdn.discordapp.com/icons/285793218023653376/7301f7da88defd2d47f18879fd3b8577.jpg');
    member.user.send(embed);

    //server status
    client.channels.get(server_status.total_users_ID).setName(`total members: ${member.guild.memberCount}`);
    client.channels.get(server_status.member_count_ID).setName(`human count: ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(server_status.bot_count_ID).setName(`bot count: ${member.guild.members.filter(m => m.user.bot).size}`);
})

client.on('guildMemberRemove', member => {
    //server status
    client.channels.get(server_status.total_users_ID).setName(`total members: ${member.guild.memberCount}`);
    client.channels.get(server_status.member_count_ID).setName(`human count: ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(server_status.bot_count_ID).setName(`bot count: ${member.guild.members.filter(m => m.user.bot).size}`);
})

client.on('message', msg => {
    if(msg.content.indexOf(config.prefix) !== 0) return;
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()

    if(command === "ads") {
        if(!msg.member.permissions.has('ADMINISTRATOR')) return msg.reply(no_acces);
        let msgChannel = msg.guild.channels.find(channel => channel.name === "general");
        if(!msgChannel) return msg.reply("nu pot gasit canalul 'general'.");
        let embed = new Discord.RichEmbed()
        .setAuthor('Announcements:')
        .setDescription('Sustine serverul de discord cu o distribuire a urmatorului link:\nInvite: https://discord.gg/zYPquPB')
        .setColor('#3388d2')
        msg.delete();
        msgChannel.send(embed);
    }
    else if(command === "clear") {
        if(msg.member.hasPermission("MANAGE_MESSAGES")) {
            msg.channel.fetchMessages()
               .then(function(list) {
                    msg.channel.bulkDelete(list);
                    msg.reply("chat cleared!");
            }, function(err){msg.channel.send("Eroare: Nu pot sterge mesajele acestui canal.")})                        
        }
    }
})

client.login(token);