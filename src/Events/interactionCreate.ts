import { Colors, EmbedBuilder } from "discord.js";
import { TEvent } from "../typings";

export default {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) {
            if (!interaction.inCachedGuild()) return;
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return;
            try {
                await cmd.run(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "Đã xảy ra lỗi khi thực thi lệnh này!",
                    ephemeral: true,
                });
            }
        } else if (interaction.isModalSubmit()) {
            if (!interaction.inCachedGuild()) return;
            const cmd = client.interactions.get(interaction.customId);
            if (!cmd) return;
            try {
                await cmd.run(client, interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "Đã xảy ra lỗi khi thực thi lệnh này!",
                    ephemeral: true,
                });
            }
        }
    },
} as TEvent<"interactionCreate">;
