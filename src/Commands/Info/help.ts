import { TSlashCommand, TSlashCommandType } from "../../typings";
import { EmbedBuilder, SlashCommandBuilder, Colors, chatInputApplicationCommandMention, EmbedField } from "discord.js";

export default {
    name: "help",
    description: "Xem tất cả lệnh của bot",
    type: TSlashCommandType.INFO,
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
            const apiCommand = await interaction.guild.commands.cache.find((c) => c.name === cmd.name);
            console.log("🚀 ~ file: help.ts:24 ~ run: ~ apiCommand", apiCommand)
            const embed = new EmbedBuilder()
                .setTitle(`Thông tin lệnh ${cmd.name}`)
                .addFields([
                    { name: "Tên lệnh", value: cmd.name, inline: true },
                    { name: "Loại lệnh", value: cmd.type, inline: true },
                    { name: "Mô tả", value: cmd.description, inline: true },
                    {name: "Lệnh", value: `${chatInputApplicationCommandMention(apiCommand?.name || "",apiCommand?.id || "")}`},
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
        } else {
            const listCommand = client.commands
            const apiCommands = await interaction.guild.commands.fetch();
            const cates = Object.values(TSlashCommandType);
            const fields: EmbedField[] = [];
            for (const cate of cates) {
                const cmds = listCommand.filter((cmd) => cmd.type === cate);
                if (cmds.size === 0) continue;
                const value = cmds
                    .map((cmd) => {
                        const apiCommand = apiCommands.find((c) => c.name === cmd.name);
                        return `${chatInputApplicationCommandMention(apiCommand?.name || "",apiCommand?.id || "")}`;
                    })
                    .join(", ");
                fields.push({ name: cate, value, inline: false });
            }
            const embed = new EmbedBuilder()
                .setTitle("Danh sách lệnh")
                .addFields(fields)
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
