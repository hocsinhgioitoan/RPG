import { TSlashCommand } from "../../typings";
import { EmbedBuilder, SlashCommandBuilder, Colors } from "discord.js";

export default {
    name: "help",
    description: "Xem tất cả lệnh của bot",
    type: "info",
    data: new SlashCommandBuilder().addStringOption((option) =>
        option
            .setName("cmd")
            .setDescription("Tên lệnh bạn muốn xem thông tin")
            .setAutocomplete(true)
    ),
    run: async (client, interaction) => {
        const focusedOption = interaction.options.getString("cmd");
        if (focusedOption) {
            const cmd = client.commands.get(focusedOption);
            if (!cmd)
                return interaction.reply({
                    content: "Không tìm thấy lệnh này",
                    ephemeral: true,
                });
            const embed = new EmbedBuilder()
                .setTitle(`Thông tin lệnh ${cmd.name}`)
                .addFields([
                    { name: "Tên lệnh", value: cmd.name, inline: true },
                    { name: "Loại lệnh", value: cmd.type, inline: true },
                    { name: "Mô tả", value: cmd.description, inline: true },
                ])
                .setColor(Colors.Aqua)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({
                        forceStatic: true,
                    }),
                })
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    },
    autocomplete: async (client, interaction) => {
        const cmd = interaction.options.getString("cmd");
        await interaction.respond(
            client.commands
                .filter(
                    (_cmd) =>
                        _cmd.name.startsWith(cmd || "") ||
                        _cmd.description.startsWith(cmd || "") ||
                        _cmd.type.startsWith(cmd || "") ||
                        _cmd.name.includes(cmd || "") ||
                        _cmd.description.includes(cmd || "") ||
                        _cmd.type.includes(cmd || "")
                )

                .map((cmd) => {
                    return {
                        name: cmd.name,
                        value: cmd.name,
                    };
                })
                .filter((cmd, i) => i < 25)
        );
    },
} as TSlashCommand;
