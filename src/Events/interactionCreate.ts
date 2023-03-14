import { TEvent } from "../typings";

export default {
    name: "interactionCreate",
    run: async (client, interaction) => {
        const errorMessage = `${client.emoji.no} Đã xảy ra lỗi khi thực thi lệnh này!`;
        if (interaction.isChatInputCommand()) {
            if (!interaction.inCachedGuild()) return;
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return;
            try {
                await cmd.run(client, interaction);
            } catch (error) {
                console.log(1);
                console.error(error);
                if (interaction.replied) {
                    return interaction.followUp({
                        content: errorMessage,
                        ephemeral: true,
                    });
                }
                await interaction.reply({
                    content: errorMessage,
                    ephemeral: true,
                });
            }
        } else if (interaction.isModalSubmit()) {
            if (!interaction.inCachedGuild()) return;
            const cmd = client.interactions.get(interaction.customId);
            if (!cmd) return;
            try {
                await cmd.run(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: errorMessage,
                    ephemeral: true,
                });
            }
        } else if (interaction.isAutocomplete()) {
            if (!interaction.inCachedGuild()) return;
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return;
            try {
                await cmd.autocomplete?.(client, interaction);
            } catch (error) {
                console.error(error);
            }
        }
    },
} as TEvent<"interactionCreate">;
