import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from "discord.js";
import { TSlashCommand, TSlashCommandType } from "../../typings";

export default {
    name: "report",
    description: "Report a bug or error",
    type: TSlashCommandType.MISC,
    data: new SlashCommandBuilder(),
    run: async (client, interaction) => {
        const reportModal = new ModalBuilder()
            .setTitle("Report a bug or error")
            .setCustomId("modal_report")
        const reportInput = new TextInputBuilder()
            .setCustomId("input_report")
            .setPlaceholder("Information")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Report")
            .setMinLength(10)
            .setMaxLength(1000)
        const row = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(reportInput)
        reportModal.addComponents(row)

        await interaction.showModal(reportModal)
        return true
    }
} as TSlashCommand;