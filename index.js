const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require("weather-js");
const token = "MzA2NDY5ODE2NTIzMjkyNjcy.C-ENxw.IdlqaFVSDvoNxysmtPh3xX49A0k";
const Wiki = require("wikijs");
var yt = require("./youtube_plugin");
var youtube_plugin = new yt();
var AuthDetails = require("./auth.json");

var prefix = "!";
var mention = "<@306469816523292672>";
var memberCount = client.users.size;
var servercount = client.guilds.size;

client.on("ready", () => {
	var servers = client.guilds.array().map(g => g.name).join(',');
	console.log("--------------------------------------");
console.log('[!]Connexion en cours... \n[!]Veuillez Patienter! \n[!]Les évenement sont après ! :)  \n[!]Les préfix actuelle:  ' + prefix + "\n[!]Mentions = " + mention + "\n[!]Nombre de membres: " + memberCount + "\n[!]Nombre de serveurs: " + servercount);
});

client.on('message', message => {
	if (message.content === ("test")){
	message.reply('test !');
} else if (message.content === ("bonjour")){
	message.reply('bonjour à toi ');
} else if (message.content === ("!news")){
    message.reply('News du serveur : \n  - Nouveau Bot : RadioBot ! Celui-ci va remplacer mes fonction musiques ! Peu à peu, Matt va supprimer ErisBot ! \n  - Nouvel @Administrateur : Blue ! :clap: \n \n Voilà les news ! Ciao Ciao !')
} else if (message.content === ("!aide")){
    message.reply('Salut, je suis StaffBot ! Voici les commandes de tous les bots : \n \n __**Avec Dyno**__ : \n     ?play + le nom de la musique ; \n \n __**Avec ErisBot**__ : \n      .music play + le nom de ta chanson \n    .music skip *pour passer la musique actuelle* \n \n __**Voilà, passe une bonne journée !**__ \n \n Le bot StaffBot a été codé par Matt')    
} else if (message.content === ("!regles")){
    message.reply('Voici les règles du serveur Burdigala : \n - Il est interdit de spammer ; \n - Toute pub doit obligatoirement être dans #pub ; \n - Toute insulte est strictement interdite ; \n - Toute discrimination est aussi strictement interdite ; \n - Il faut être respectueux, gentil et poli. \n \n Tout non-respect des règles énoncées ci-dessus seront puni comme indiqué dans #regles. \n \n \n __**Le bot StaffBot a été codé par Matt.**__')    

} else if(message.content.startsWith('!botname')){
	client.user.setUsername(message.content.substr(9));
} else if (message.content === "!stats") {
	let m = " ";
	m += 'Il y a actuellement  ${message.guild.channels.size} channels sur ce serveurs \n';
	m += 'je suis en compagnie de ${message.guild.members.size} membres';
	m += 'je suis présent dans ${client.guild.size} serveurs \n';
	message.author.sendMessage(m).catch(console.log); 
} 
else if (message.content.startsWith("!météo")){
    var location = message.content.substr(6);
    var unit = "C";
    
    try {
        weather.find({search: location, degreeType: unit}, function(err, data) {
            if(err) {
                console.log(Date.now(), "DANGER", "Je ne peut pas trouvé d'information pour la méteo de " + location);
                message.reply("\n" + "Je ne peut pas trouvé d'information pour la méteo de " + location);
            } else {
                data = data[0];
               console.log("**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
               message.reply("\n" + "**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
            }
        });
    } catch(err) {
        console.log(Date.now(), "ERREUR", "Weather.JS a rencontré une erreur");
        message.reply("Idk pourquoi c'est cassé tbh :(");
        }
    }
else if (message.content.startsWith("!wiki")){
            if(!message.content.substr(5)) {
                console.log(Date.now(), "DANGER", "Vous devez fournir un terme de recherche.");
                message.reply("Vous devez fournir un terme de recherche.");
                return;
            }
            var wiki = new Wiki.default();
            wiki.search(message.content.substr(5)).then(function(data) {
                if(data.results.length==0) {
                    console.log(Date.now(), "DANGER","Wikipedia ne trouve pas ce que vous avez demandée : " + message.content.substr(5));
                    message.reply("Je ne peut trouver ce que vous voulez dans Wikipedia :(");
                    return;
                }
                wiki.page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        if(summary.indexOf(" may refer to:") > -1 || summary.indexOf(" may stand for:") > -1) {
                            var options = summary.split("\n").slice(1);
                            var info = "Selectionnez une options parmis celle-ci :";
                            for(var i=0; i<options.length; i++) {
                                info += "\n\t" + i + ") " + options[i];
                            }
                            message.reply(info);
                            selectMenu(message.channel, message.author.id, function(i) {
                                commands.wiki.process(Client, message, options[i].substring(0, options[i].indexOf(",")));
                            }, options.length-1);
                        } else {
                            var sumText = summary.split("\n");
                            var count = 0;
                            var continuation = function() {
                                var paragraph = sumText.shift();
                                if(paragraph && count<3) {
                                    count++;
                                    message.reply(message.channel, paragraph, continuation);
                                }
                            };
                            message.reply("**Trouvé " + page.raw.fullurl + "**", continuation);
                        }
                    });
                });
            }, function(err) {
                console.log(Date.now(), "ERREUR","Impossible de se connecté a Wikipédia");
                message.reply("Uhhh...Something went wrong :(");
            });

        
} 

            if(message.content.startsWith("!info")) {
    var memberavatar = message.author.avatarURL
    var membername = message.author.username
       var mentionned = message.mentions.users.first();
      var getvalueof;
      if(mentionned){
          var getvalueof = mentionned;
      } else {
          var getvalueof = message.author;
      }

      if(getvalueof.bot == true){
          var checkbot = "L'utilisateur est un bot";
      } else {
          var checkbot = "N'est pas un bot";
      }
      if(getvalueof.presence.status == 'online'){
        var status = "En ligne"; 
      }else {
        var status = "Hors ligne";
      }

    message.channel.sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: 'Pseudo',
            value: getvalueof.username,
            inline: true
          }, {
            name: 'User id',
            value: getvalueof.id,
            inline: true
          },{
            name: 'Discriminateur',
            value: getvalueof.discriminator,
            inline: true
},{
            name: 'Status',
            value: status,
            inline: true
},{
            name: 'Bot',
            value: checkbot,
            inline: true
}],
        image: {
      url: getvalueof.avatarURL
        },
          color: 0xE46525,
          footer: {
            text: 'by Matt',
            proxy_icon_url: ' '
          },

          author: {
            name: membername,
            icon_url: memberavatar,
            proxy_icon_url: ' '
          }
        }
});
}
 else if(message.content.startsWith('!kick')){
            let StaffRole = message.guild.roles.find("name", "Staff");
if(!message.member.roles.has(StaffRole.id)) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
    if(!message.guild.roles.exists("name", "Staff")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Staff** n'existe pas dans ce serveur veuillez le créer pour Kick! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
if(message.mentions.users.size === 0) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez Kick. **Format ~> `!kick @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
}
let kickMember = message.guild.member(message.mentions.users.first());
if(!kickMember) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
}
if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
  return message.reply("Je n'ai pas la permissions ** __(KICK_MEMBERS)__ **!").catch(console.error);
}
         if(!message.guild.channels.exists("name", "staff_news")){
// créer le channel
message.guild.createChannel('staff_news');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `staff_news` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par StaffBot."
}
}}).catch(console.error);
}   
kickMember.kick().then(member => {
    message.channel.sendMessage("", {embed: {
          title: "Succès :white_check_mark:",
          color: 0xff0000,
          description: `${member.user.username}`+` à bien été kick`,
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
}).then(message.guild.channels.find('name','staff_news').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: kickMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: kickMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "Kick",
            inline: true
},{
            name: 'Stafférateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Stafferation',
            proxy_icon_url: ' '
          },

          author: { 
            name: kickMember.user.username + "#"+ kickMember.user.discriminator,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
         else if(message.content.startsWith('!ban')){
            let StaffRole = message.guild.roles.find("name", "Admin_Ban");
if(!message.member.roles.has(StaffRole.id)) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
    if(!message.guild.roles.exists("name", "Admin_Ban")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Admin_Ban** n'existe pas dans ce serveur veuillez le créer pour Kick! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
if(message.mentions.users.size === 0) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez Ban. **Format ~> `!ban @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
}
let banMember = message.guild.member(message.mentions.users.first());
if(!banMember) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
}
if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
  return message.reply("Je n'ai pas la permissions ** __(BAN_MEMBERS)__ **!").catch(console.error);
}
         if(!message.guild.channels.exists("name", "staff_news")){
// créer le channel
message.guild.createChannel('staff_news');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `staff_news` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par StaffBot."
}
}}).catch(console.error);
}   
banMember.kick().then(member => {
    message.channel.sendMessage("", {embed: {
          title: "Succès :white_check_mark:",
          color: 0xff0000,
          description: `${member.user.username}`+` à bien été ban`,
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
}).then(message.guild.channels.find('name','staff_news').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: banMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: banMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "ban",
            inline: true
},{
            name: 'Administrateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Stafferation',
            proxy_icon_url: ' '
          },

          author: { 
            name: banMember.user.username + "#"+ banMember.user.discriminator,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        else if(message.content.startsWith('!mute')){
            let StaffRole = message.guild.roles.find("name", "Staff");
    if(!message.guild.roles.exists("name", "staff")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Staff** n'existe pas dans ce serveur veuillez le créer pour Mute! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(StaffRole.id)) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
      if(message.mentions.users.size === 0) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez mute totalment. **Format ~> `!mute @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      }
      let muteMember = message.guild.member(message.mentions.users.first());
      if(!muteMember) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      }
      if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Je n'ai pas la permissions pour faire cela __(MANAGE_MESSAGES)__ !").catch(console.error);
      }
         if(!message.guild.channels.exists("name", "staff_news")){
// créer le channel
message.guild.createChannel('staff_news');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `staff_news` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par StaffBot."
}
}}).catch(console.error);
}     
let mutedRole = message.guild.roles.find("name", "mute");
    var time = 500000;
    console.log(muteMember);
      muteMember.addRole(mutedRole).then(member => {
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :white_check_mark:  Vous avez bien mute ** "+ muteMember + " dans le serveur "+message.guild.name  + " ! :white_check_mark: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).then(message.guild.channels.find('name','staff_news').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: muteMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: muteMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "mute total",
            inline: true
},{
            name: 'Stafférateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Stafferation',
            proxy_icon_url: ' '
          },

          author: { 
            name: muteMember.user.username,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        )}
       else if(message.content.startsWith('!unmute')){
            let StaffRole = message.guild.roles.find("name", "Staff");
            if(!message.guild.roles.exists("name", "Staff")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Staff** n'existe pas dans ce serveur veuillez le créer pour unmute! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      }
    if(!message.guild.roles.exists("name", "mute")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **mute** n'existe pas dans ce serveur veuillez le créer pour Unmute! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(StaffRole.id)) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
      if(message.mentions.users.size === 0) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez unmute totalment. **Format ~> `!unmute @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      }
      let muteMember = message.guild.member(message.mentions.users.first());
      if(!muteMember) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      }
      if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Je n'ai pas la permissions pour faire cela __(MANAGE_MESSAGES)__ !").catch(console.error);
      }
         if(!message.guild.channels.exists("name", "staff_news")){
// créer le channel
message.guild.createChannel('staff_news');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `staff_news` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par StaffBot."
}
}}).catch(console.error);
}   
let mutedRole = message.guild.roles.find("name", "mute");
    var time = 500000;
    console.log(muteMember);
      muteMember.removeRole(mutedRole).then(member => {
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :white_check_mark:  Vous avez bien unmute ** "+ muteMember + " dans le serveur "+message.guild.name  + " ! :white_check_mark: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).then(message.guild.channels.find('name','staff_news').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: muteMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: muteMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "unmute total",
            inline: true
},{
            name: 'Stafférateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Stafferation',
            proxy_icon_url: ' '
          },

          author: { 
            name: muteMember.user.username,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        )}else if (message.content.startsWith("!clear")) {
      let StaffRole = message.guild.roles.find("name", "Admin_Ban");
            if(!message.guild.roles.exists("name", "Admin_Ban")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Admin_Ban** n'existe pas dans ce serveur veuillez le créer pour Clear! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(StaffRole.id)) {
        return   message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par StaffBot."
          }
        }}).catch(console.error);
      }
    var args = message.content.substr(7);
      if(args.length === 0){
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x: Vous n'avez pas précisser le nombre :x: ",
          footer: {
            text: "Message par StaffBot."
          }
        }});
      }
      else {
        var msg;
        if(args.length === 1){
        msg = 2;
      } else {
        msg = parseInt(args[1]);
      }
      message.channel.fetchMessages({limit: msg}).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
      message.channel.sendMessage("", {embed: {
        title: "Succès!",
        color: 0x06DF00,
        description: "Messages Suprimé!",
        footer: {
          text: "Message par StaffBot."
        }
      }});
      }
}              

else if (message.content.startsWith('!youtube')){
youtube_plugin.respond(message.content, message.channel , client);
}
});

client.login(token)