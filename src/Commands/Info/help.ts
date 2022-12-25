import { TSlashCommand, TSlashCommandType } from "../../typings";
import {
    EmbedBuilder,
    SlashCommandBuilder,
    Colors,
    chatInputApplicationCommandMention,
    EmbedField,
} from "discord.js";
import { announceChannelId } from "../../utils/constants";

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
        // get new news for bot
        const announceChannel = client.channels.cache.get(announceChannelId);
        if (!announceChannel?.isTextBased()) return;
        const messages = await announceChannel.messages.fetch({ limit: 1 });
        const message = messages.first();
        let emb: EmbedBuilder;
        const fixedContent = message?.content
            .replace(/@everyone/g, "@\u200beveryone")
            .replace(/@here/g, "@\u200bhere");
        const _emb = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setTimestamp()
            .setAuthor({
                name: message?.author.tag || "",
                iconURL: message?.author.displayAvatarURL({
                    forceStatic: true,
                }),
            })
            .setTitle("Tin mới");
        if (message?.embeds?.length ||0> 0) emb = EmbedBuilder.from(message?.embeds[0]!);
        else emb = _emb.setDescription(fixedContent || "Không có tin mới");
        console.log(emb)
        if (focusedOption) {
            const cmd = client.commands.get(focusedOption);
            if (!cmd)
                return interaction.reply({
                    content: "Không tìm thấy lệnh này",
                    ephemeral: true,
                });
            const apiCommand = await interaction.guild.commands.cache.find(
                (c) => c.name === cmd.name
            );
            const embed = new EmbedBuilder()
                .setTitle(`Thông tin lệnh ${cmd.name}`)
                .addFields([
                    { name: "Tên lệnh", value: cmd.name, inline: true },
                    { name: "Loại lệnh", value: cmd.type, inline: true },
                    { name: "Mô tả", value: cmd.description, inline: true },
                    {
                        name: "Lệnh",
                        value: `${chatInputApplicationCommandMention(
                            apiCommand?.name || "",
                            apiCommand?.id || ""
                        )}`,
                    },
                ])
                .setColor(Colors.Aqua)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({
                        forceStatic: true,
                    }),
                })
                .setTimestamp();
            return interaction.reply({ embeds: [embed, emb] });
        } else {
            const listCommand = client.commands;
            const apiCommands = await interaction.guild.commands.fetch();
            const cates = Object.values(TSlashCommandType);
            const fields: EmbedField[] = [];
            for (const cate of cates) {
                const cmds = listCommand.filter((cmd) => cmd.type === cate);
                if (cmds.size === 0) continue;
                const value = cmds
                    .map((cmd) => {
                        const apiCommand = apiCommands.find(
                            (c) => c.name === cmd.name
                        );
                        return `${chatInputApplicationCommandMention(
                            apiCommand?.name || "",
                            apiCommand?.id || ""
                        )}`;
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
            return interaction.reply({ embeds: [embed, emb] });
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
