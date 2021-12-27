import Discord from "discord.js";
import dotenv from "dotenv";
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
    getVoiceConnection
} from '@discordjs/voice';

dotenv.config();

const client = new Discord.Client({
	intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ],
});

const player = createAudioPlayer();
var connection;

client.on("ready", async () => {
    console.log("Bot ready as " + client.user.username + "#" + client.user.discriminator);
});

client.on('voiceStateUpdate', async (oldMember, newMember) => {
    if(oldMember.channelId === newMember.channelId) return;

    let newChannel = newMember.channelId ? await (await client.guilds.fetch(oldMember.guild.id)).channels.fetch(newMember.channelId) : false;
    let oldChannel = oldMember.channelId ? await (await client.guilds.fetch(newMember.guild.id)).channels.fetch(oldMember.channelId) : false;

    if(newChannel) {
        // play
        connection = joinVoiceChannel({
            channelId: newChannel.id,
            guildId: newChannel.guild.id,
            adapterCreator: newChannel.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer();
        const rickRoll = createAudioResource("./rickroll.mp3");

        connection.subscribe(player);
        player.play(rickRoll);
    } else if(oldChannel.members.filter(v => !v.user.bot) && getVoiceConnection(oldChannel.guild.id)) {
        getVoiceConnection(oldChannel.guild.id).destroy();
    }
 });

client.login(process.env.TOKEN);