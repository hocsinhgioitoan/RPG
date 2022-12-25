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
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    },
} as TEvent<"interactionCreate">;
