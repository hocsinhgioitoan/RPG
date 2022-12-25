import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { TSlashCommand, TSlashCommandType } from "../../typings";
import { announceChannelId } from '../../utils/constants';

export default {
    name: "announce",
    description: "Nhận thông báo mới nhất từ bot",
    type: TSlashCommandType.MISC,
    data: new SlashCommandBuilder(),
    run: async (client, interaction) => {
        const announceChannel = client.channels.cache.get(
            announceChannelId
        );
        if (!announceChannel?.isTextBased()) return;
        const messages = await announceChannel.messages.fetch({ limit: 1 });
        const message = messages.first();
        if (!message) return interaction.reply("Không có thông báo mới nào!");
        if (message.embeds.length > 0) {
            const embed = message.embeds[0];
            const embedBuilder = EmbedBuilder.from(embed);
            return await interaction.reply({
                embeds: [embedBuilder],
            });
        }
        const fixedContent = message.content.replace(/@everyone/g, "@\u200beveryone").replace(/@here/g, "@\u200bhere")
        // convert time to DD/MM/YYYY:HH:MM:SS by using new Date().toLocaleString()
        const time = message.createdAt.toLocaleString()
        return await interaction.reply({
            content: `[${message.author.username} (${time})]: \n`+fixedContent,
            files: message.attachments.map((attachment) => attachment.url),
        });
    },
} as TSlashCommand;
