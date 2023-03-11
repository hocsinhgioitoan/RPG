import { TSlashCommand, TSlashCommandType } from "../../typings";
import {
    SlashCommandBuilder,
    EmbedBuilder,
    InteractionResponse,
    ComponentType,
    ButtonInteraction,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} from "discord.js";
import { Craft, Inventory } from "../../Class/lib";
import _ from "lodash";
import { Pagination } from "pagination.djs";
export default {
    name: "craft",
    description: "Chế tạo vật phẩm",
    type: TSlashCommandType.RPG,
    data: new SlashCommandBuilder(),
    async run(client, interaction) {
        const craft = new Craft();
        const items = craft.getListItems;
        const fields = items.map((item) => craft.generateField(item));
        const _fields = _.chunk(fields, 24);
        const embeds: EmbedBuilder[] = [];
        const buttons: ButtonBuilder[][] = [];
        const inventory = new Inventory([
            {
                id: 1000,
                amount: 100,
            },
            {
                id: 1001,
                amount: 100,
            },
        ]);
        for (const field of _fields) {
            const embed = new EmbedBuilder().addFields(field);
            embeds.push(embed);
            buttons.push(
                field.map((f) => {
                    const [emoji, ...name] = f.name.split(" ");
                    return new ButtonBuilder()
                        .setCustomId(`button_caft_item_${name.join(" ")}`)
                        .setLabel(emoji ?? client.emoji.unknown)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(
                            !craft.canCraft(
                                inventory,
                                craft.findItemByName(name.join(" "))!
                            )
                        );
                })
            );
        }
        const rows: ActionRowBuilder<ButtonBuilder>[] = [];
        for (const button of buttons) {
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                button
            );
            rows.push(row);
        }
        embeds.splice(0, 1, craft.show());
        const page = new Pagination(interaction);
        page.addActionRows(rows);
        page.setEmbeds(embeds);
        const i = await page.reply();
        if (!(i instanceof InteractionResponse<true>)) return;
        // eslint-disable-next-line no-shadow
        const filter = (i: ButtonInteraction) =>
            i.customId.startsWith("button_caft_item_");
        const collector = i.createMessageComponentCollector({
            filter,
            time: 1000 * 60 * 5,
            componentType: ComponentType.Button,
        });
        collector.on("collect", async (i2) => {
            const [, , , name] = i2.customId.split("_");
            const item = craft.findItemByName(name);
            if (!item) return;
            if (craft.canCraft(inventory, item)) {
                craft.craft(inventory, item);
                i2.update({
                    components: [],
                    embeds: [],
                    content: "Đã chế tạo thành công",
                });
                return;
            }
            i2.update({
                components: [],
                embeds: [],
                content: "Đã chế tạo thất bại",
            });
        });
    },
} as TSlashCommand;
