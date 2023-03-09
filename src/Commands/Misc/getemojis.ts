import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    Message,
    SlashCommandBuilder,
} from "discord.js";
import { TSlashCommand, TSlashCommandType } from "../../typings";
import { ExtraRowPosition, Pagination } from "pagination.djs";
export default {
    name: "getemojis",
    description: "Get all emojis in the server",
    type: TSlashCommandType.MISC,
    data: new SlashCommandBuilder(),
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const emojis = (
            await client.guilds.cache.get(interaction.guildId)?.emojis.fetch()
        )?.map((e) => {
            const _e = e.toString();
            return `${_e} - \`${_e}\``;
        });
        if (!emojis) {
            return interaction.editReply({
                content: `${client.emoji.no} No emojis found`,
            });
        }
        const pages = new Pagination(interaction, {
            limit: 10,
            ephemeral: true,
        });
        pages.setDescriptions(emojis);
        pages.addActionRows(
            [
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder()
                        .setCustomId("getallemojis_tojson")
                        .setLabel("To JSON")
                        .setStyle(ButtonStyle.Primary),
                ]),
            ],
            ExtraRowPosition.Below
        );
        const i = await pages.editReply();
        if (i instanceof Message) {
            // eslint-disable-next-line no-shadow
            const filter = (i: ButtonInteraction) =>
                i.customId === "getallemojis_tojson";
            const collector = i.createMessageComponentCollector({
                filter,
                time: 1000 * 60 * 5,
                componentType: ComponentType.Button,
            });

            collector.on("collect", async (_i) => {
                if (_i.customId === "getallemojis_tojson") {
                    const emojiMap = emojis.map((e) => {
                        const _emoji = e.split(" - ")[0];
                        return {
                            name: _emoji.split(":")[1].split(":")[0],
                            emoji: _emoji,
                        };
                    });
                    // [<:abc:id>] -> {abc: "<:abc:id>"}
                    await _i.update({
                        content: `\`\`\`json\n${JSON.stringify(
                            Object.fromEntries(
                                emojiMap.map((e) => [e.name, e.emoji])
                            ),
                            null,
                            4
                        )}\`\`\`
                                    `,
                        embeds: [],
                        components: [],
                    });
                }
            });
        }
    },
} as TSlashCommand;
