import { SlashCommandBuilder } from "discord.js";
import { TSlashCommand, TSlashCommandType } from "../../typings";
import { BaseFighter } from "../../Class/lib";
import { TPlayerData } from "../../Class/lib/types";
export default {
    name: "profile",
    description: "View your profile",
    type: TSlashCommandType.RPG,
    data: new SlashCommandBuilder(),
    run: async (client, interaction) => {
        const playerData = await client.db.get<TPlayerData>(
            `game.player.info.${interaction.user.id}`
        );
        const player = new BaseFighter({
            ...playerData,
            id: interaction.user.id,
            name: interaction.user.username,
            imageUrl: interaction.user.displayAvatarURL({ forceStatic: true }),
        });
        const embed = player.show();

        await interaction.reply({ embeds: [embed] });
    },
} as TSlashCommand;
