import { Inventory } from "../../Class/lib";
import { TSlashCommand, TSlashCommandType } from "../../typings";
import { SlashCommandBuilder } from "discord.js";

export default {
    name: "inventory",
    description: "View your inventory",
    type: TSlashCommandType.RPG,
    data: new SlashCommandBuilder(),
    run: async (client, interaction) => {
        // const inventoryData = await client.db.get<TItemData[]>(
        //     `game.player.inventory.${interaction.user.id}`
        // );
        const inventory = new Inventory([
            {
                id: 1000,
                amount: 100,
            },
            {
                id: 2,
                amount: 1,
            }
        ]);

        await interaction.reply({ embeds: [inventory.show()] });
    },
} as TSlashCommand;
