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
    ChatInputCommandInteraction,
} from "discord.js";
import { Craft, Inventory } from "../../Class/lib";
import _ from "lodash";
import { Pagination } from "pagination.djs";
import { TItemData } from "../../Class/lib/types";
export default {
    name: "craft",
    description: "Chế tạo vật phẩm",
    type: TSlashCommandType.RPG,
    data: new SlashCommandBuilder(),
    async run(client, interaction) {
        // const inventoryData = await client.db.get<TItemData[]>(
        //     `game.player.inventory.${interaction.user.id}`
        // );
        const inventory = new Inventory([
            {
                id: 1000,
                amount: 100,
            },
        ]);
        const [page, craft] = createPages(interaction, inventory);
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
                const [page2] = createPages(interaction, inventory);
                const payloads = page2.ready();
                const message = await i2.update(payloads);
                page2.paginate(message);
                await client.db.set(
                    `game.player.inventory.${interaction.user.id}`,
                    inventory.data
                );
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

function createPages(
    interaction: ChatInputCommandInteraction<"cached">,
    inventory: Inventory
): [Pagination, Craft] {
    const craft = new Craft();
    const items = craft.getListItems;
    const fields = items.map((item) => craft.generateField(item, inventory));
    const _fields = _.chunk(fields, 24);
    const embeds: EmbedBuilder[] = [];
    const buttons: ButtonBuilder[][] = [];
    for (const field of _fields) {
        const embed = new EmbedBuilder().setDescription(field.join("\n"));
        embeds.push(embed);
        buttons.push(
            field.map((f) => {
                // eslint-disable-next-line prefer-const
                let [emoji, ...name] = f.split(" ");
                name = name
                    .filter((n) => !n.startsWith("<"))
                    .map((n) => n.replace(":", ""));
                const _name = name.join(" ").replace("| ", "");
                return new ButtonBuilder()
                    .setCustomId(`button_caft_item_${_name}`)
                    .setEmoji(
                        !emoji.startsWith("<")
                            ? emoji
                            : {
                                name: emoji.split(":")[1].split(":")[0],
                                id: emoji.split(":")[2].split(">")[0],
                                animated: emoji.startsWith("<a:"),
                            }
                    )
                    .setLabel(" ")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(
                        !craft.canCraft(
                            inventory,
                            craft.findItemByName(
                                _name
                            )!
                        )
                    );
            })
        );
    }
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (const button of buttons) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        rows.push(row);
    }
    embeds.splice(0, 1, craft.show(inventory));
    const page = new Pagination(interaction);
    page.addActionRows(rows);
    page.setEmbeds(embeds);
    return [page, craft];
}
