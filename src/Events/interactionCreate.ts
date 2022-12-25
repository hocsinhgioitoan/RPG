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
            if (interaction.customId === "modal_report") {
                const input =
                    interaction.fields.getTextInputValue("input_report");
                if (input) {
                    await interaction.reply({
                        content: "Đã gửi báo cáo của bạn!",
                        ephemeral: true,
                    });
                    client.funcs.sendWH(
                        {
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Report")
                                    .setColor(Colors.Green)
                                    .setDescription(input)
                                    .setAuthor({
                                        name: interaction.user.tag,
                                        iconURL:
                                            interaction.user.displayAvatarURL(),
                                    })
                                    .setTimestamp()
                                    .addFields([
                                        {
                                            name: "Guild",
                                            value:
                                                interaction.guild?.name ?? "DM",
                                            inline: true,
                                        },
                                    ]),
                            ],
                        },
                        "https://ptb.discord.com/api/webhooks/1056393069320208455/AwdhVtKEyaNJsth8vAlJ_8V2MuksFCE-GhKwAxToGXzWEsLBdUp455lxm1iH5B8DKHLQ"
                    );
                }
            }
        }
    },
} as TEvent<"interactionCreate">;
