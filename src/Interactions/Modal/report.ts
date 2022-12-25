import { Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { TInteraction } from "../../typings";

export default {
    name: "modal_report",
    run: async (client, interaction) => {
        const input = interaction.fields.getTextInputValue("input_report");
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
                                iconURL: interaction.user.displayAvatarURL(),
                            })
                            .setTimestamp()
                            .addFields([
                                {
                                    name: "Guild",
                                    value: interaction.guild?.name ?? "DM",
                                    inline: true,
                                },
                            ]),
                    ],
                },
                "https://ptb.discord.com/api/webhooks/1056393069320208455/AwdhVtKEyaNJsth8vAlJ_8V2MuksFCE-GhKwAxToGXzWEsLBdUp455lxm1iH5B8DKHLQ",
            );
        }
    },
} as TInteraction<ModalSubmitInteraction<"cached">>;