import { Inventory } from "../../Class/lib";
import { TItemData } from "../../Class/lib/types";
import { TSlashCommand, TSlashCommandType } from "../../typings";
import { SlashCommandBuilder } from "discord.js";

export default {
    name: "inventory",
    description: "View your inventory",
    type: TSlashCommandType.RPG,
    data: new SlashCommandBuilder(),
    run: async (client, interaction) => {
        const inventoryData = await client.db.get<TItemData[]>(
            `game.player.inventory.${interaction.user.id}`
        );
        const inventory = new Inventory(inventoryData);
        await interaction.reply({ embeds: [inventory.show()] });
    },
} as TSlashCommand;
