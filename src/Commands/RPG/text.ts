import { SlashCommandBuilder } from "discord.js";
import { TSlashCommand, TSlashCommandType } from "../../typings";
import { Fighter } from '../../Class/lib/';
export default {
    name: "test",
    description: "Ping pong",
    type: TSlashCommandType.RPG,
    data: new SlashCommandBuilder(),
    run: async (client, interaction) => {
        const playerA = new Fighter("Player A");
        const playerB = new Fighter("Player B");

        playerA.attack = 10;
        playerB.attack = 11;
        interaction.reply({
            embeds: [
                playerA.show(),
            ],
        });
    },
} as TSlashCommand;