const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
var query = require('samp-query');

const server_status = { total_users_ID: '785514977133199360' }

let cooldown = new Set();
let cdseconds = 180;

client.on('ready', () => {
    console.log('I am online now!');
	
    var raportCNL = client.channels.find(channel => channel.id === '784872604497608755');
    setInterval(() => {
	raportCNL.send("---------------------");
	setTimeout(function() { GetServerPlayers(raportCNL, "193.203.39.77", 'U-SOCIETY') }, 1000)
	raportCNL.send("---------------------");
    }, 86400000);
})

client.on('guildMemberAdd', member => {
    let join_channel = client.channels.get('784872604497608755')
    join_channel.send(`**[+]** ${member} s-a alaturat acestui grup!`);

    const embed = new Discord.RichEmbed()
        .setAuthor(`Bine ai venit pe U-SOCIETY, ${member.displayName}!`)
        .setDescription('**Iti uram sedere placuta alaturi de noi.\nDaca ai intrebari, ni le poti adresa pe chatul <#general>.\n\nO zi/seara/dimineata placuta :wink:!**')
        .setThumbnail('https://cdn.discordapp.com/app-icons/736176308119273503/4481c09d42f4ec582a6d646bdc4b1e1a.png')
        .setColor('#3388d2')
        .setTimestamp()
        .setFooter('joined', 'https://cdn.discordapp.com/app-icons/736176308119273503/4481c09d42f4ec582a6d646bdc4b1e1a.png');
    member.user.send(embed);

    //server status
    let users_channel = client.channels.get(server_status.total_users_ID)
    users_channel.setName(`members: ${member.guild.members.filter(m => !m.user.bot).size}`);
})

client.on('guildMemberRemove', member => {
    //server status
    let users_channel = client.channels.get(server_status.total_users_ID)
    users_channel.setName(`members: ${member.guild.members.filter(m => !m.user.bot).size}`);
})

client.on('message', msg => {
    if(msg.content === "Salut") {
        if(cooldown.has(msg.author.id)) return;
        msg.channel.send('Salutare!');
        
        cooldown.add(msg.author.id);   

        setTimeout(() => {
            cooldown.delete(msg.author.id)  
        }, cdseconds * 1000)
    }
  
    if(msg.content.indexOf(config.prefix) !== 0) return;
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()

    if(command === "ads") {
        if(!msg.member.permissions.has('ADMINISTRATOR')) return msg.reply("nu ai acces la aceasta comanda!");
        let message_channel = msg.mentions.channels.first();
        if(message_channel) {
            let embed = new Discord.RichEmbed()
            .setAuthor('Announcements:')
            .setDescription('Sustine serverul de discord cu o distribuire a urmatorului link:\nInvite: https://discord.gg/DsWCJDa')
            .setColor('#AB51A1')
            msg.delete();
            message_channel.send(embed);
        } else {
            let embed = new Discord.RichEmbed()
            .setAuthor('Announcements:')
            .setDescription('Sustine serverul de discord cu o distribuire a urmatorului link:\nInvite: https://discord.gg/DsWCJDa')
            .setColor('#AB51A1')
            msg.delete();
            msg.channel.send(embed);
        }
    }
    else if(command === "cc") {
        if(msg.member.hasPermission("MANAGE_MESSAGES")) {
            msg.channel.fetchMessages()
               .then(function(list) {
                    msg.channel.bulkDelete(list);
                    msg.reply("chat cleared!");
            }, function(err){msg.channel.send("Eroare: Nu pot sterge mesajele acestui canal.")})                        
        } else { msg.reply("nu ai acces la aceasta comanda!"); }
    }
    else if(command === "sstats") {
    	if(!msg.member.permissions.has('MANAGE_MESSAGES')) return msg.reply("nu ai acces la aceasta comanda!");
	raportCNL.send("---------------------");
	setTimeout(function() { GetServerPlayers(raportCNL, "193.203.39.77", 'U-SOCIETY') }, 1000)
	raportCNL.send("---------------------");
    }
})

function GetServerPlayers(msg, ip, sv_name) {
	var options = { host: ip }
	query(options, function (error, response) {
	    if(error) msg.send(`**${sv_name}**: Can't get result!`);
	    else msg.send(`**${sv_name}**: ${response['online']}/${response['maxplayers']}`);
	})
}

client.login(process.env.TOKEN);
