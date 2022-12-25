import { SlashCommandBuilder } from "discord.js";
import { TSlashCommand, TSlashCommandType } from "../../typings";

export default {
    name: "ping",
    description: "Ping pong",
    type: TSlashCommandType.INFO,
    data: new SlashCommandBuilder(),
    run: async (client, interaction) => {
        const ping = client.ws.ping;
        const latency = Date.now() - interaction.createdTimestamp;
        await interaction.reply({
            content: `Pong! Ping: ${ping}ms, Latency: ${latency}ms`,
            ephemeral: true,
        });
    },
} as TSlashCommand;