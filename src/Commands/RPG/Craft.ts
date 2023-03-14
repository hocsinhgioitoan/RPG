import { TSlashCommand, TSlashCommandType } from "../../typings";
import {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ComponentType,
    StringSelectMenuInteraction,
    Colors,
    CommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    ButtonInteraction,
} from "discord.js";
import { Craft, Inventory } from "../../Class/lib";
import { EItemTypes, TItem } from "../../Class/lib/types";
import _ from "lodash";
import NullClient from "../../Class/Client";
export default {
    name: "craft",
    description: "Chế tạo vật phẩm",
    type: TSlashCommandType.RPG,
    data: new SlashCommandBuilder(),
    async run(client, interaction) {
        // const inventoryData = await client.db.get<TItemData[]>(
        //     `game.player.inventory.${interaction.user.id}`
        // );
        await interaction.deferReply({
            fetchReply: true,
        });
        const inventory = new Inventory([
            {
                id: 1000,
                amount: 100,
            },
        ]);
        const craft = new Craft();
        const listItems = craft.getListItems;
        const objMainItems = {
            [EItemTypes.MATERIAL]: client.emoji.stick,
            [EItemTypes.SWORD]: client.emoji.wooden_sword,
            [EItemTypes.PICKAXE]: client.emoji.wooden_pickaxe,
            [EItemTypes.AXE]: client.emoji.wooden_axe,
            [EItemTypes.SHOVEL]: client.emoji.wooden_shovel,
        };
        const cate = listItems.map((item) => {
            return item.type;
        });
        const listCate = _.uniq(cate);
        const time = 1000 * 60 * 1;
        const returnData = (stt: boolean, i: string | TItem) => {
            if (typeof i !== "string") {
                return {
                    label: "",
                    value: "",
                    description: "",
                    emoji: "",
                };
            }
            return {
                label: i[0].toUpperCase() + i.slice(1),
                value: `${i}_${stt}`,
                description: `Vật phẩm của loại ${i}`,
                emoji: (objMainItems[i as EItemTypes] as string)!,
            };
        };
        const returnData2 = (value: string, i: TItem | string) => {
            if (typeof i === "string") {
                return {
                    label: "",
                    value: "",
                    description: "",
                    emoji: "",
                };
            }
            return {
                label: i.name[0].toUpperCase() + i.name.slice(1),
                value: `${value}_${i.id}`,
                description: `Vật phẩm của loại ${i.name}`,
                emoji: i.emoji as string,
            };
        };
        const selectRow = returnSelectMenu(
            "craft_select_cate",
            listCate,
            returnData.bind(null, false)
        );
        const inter = await interaction.editReply({
            content: "Chọn loại vật phẩm",
            components: [selectRow],
        });
        const filter = (i: StringSelectMenuInteraction) => {
            return i.user.id === interaction.user.id;
        };
        const collector = inter.createMessageComponentCollector({
            filter,
            time,
            componentType: ComponentType.StringSelect,
        });

        collector
            .on("collect", async (_i) => {
                if (_i.customId === "craft_select_cate") {
                    await _i.deferUpdate();
                    const [value, stt] = _i.values[0].split("_");
                    const items = listItems.filter((item) => {
                        return item.type === value;
                    });
                    const selectItemRow = returnSelectMenu(
                        `craft_select_item`,
                        items,
                        returnData2.bind(null, value)
                    );
                    await interaction.editReply({
                        content: "Chọn vật phẩm",
                        components: [
                            returnSelectMenu(
                                "craft_select_cate",
                                listCate,
                                returnData.bind(null, false),
                                listCate.indexOf(value)
                            ),
                            selectItemRow,
                        ],
                    });
                } else if (_i.customId === "craft_select_item") {
                    await _i.deferUpdate();
                    const [cate2, id] = _i.values[0].split("_");
                    const items = listItems.filter((item) => {
                        return item.type === cate2;
                    });
                    const itemSelect = craft.findItemById(Number(id)) as TItem;
                    const embed = embedGen(
                        itemSelect,
                        craft,
                        inventory,
                        interaction,
                        Colors.Blue,
                        client
                    );
                    const craftRow = genButtonCreates(
                        inventory,
                        itemSelect,
                        craft
                    );

                    const inter2 = await interaction.editReply({
                        content: "Chế tạo vật phẩm",
                        embeds: [embed],
                        components: [
                            returnSelectMenu(
                                "craft_select_cate",
                                listCate,
                                returnData.bind(null, true),
                                listCate.indexOf(cate2)
                            ),
                            returnSelectMenu(
                                `craft_select_item`,
                                items,
                                returnData2.bind(null, cate2),
                                items.indexOf(itemSelect)
                            ),
                            craftRow,
                        ],
                    });
                    const filter2 = (i: ButtonInteraction) => {
                        return i.user.id === interaction.user.id;
                    };
                    const collector2 = inter2.createMessageComponentCollector({
                        filter: filter2,
                        time,
                        componentType: ComponentType.Button,
                    });
                    collector2
                        .on("collect", async (_i2) => {
                            const [, , id2, amount] = _i2.customId.split("_");
                            const item = craft.findItemById(Number(id2)) as TItem;
                            const amount2 = Number(amount);
                            const stt = craft.craft(inventory, item, amount2);
                            if (stt) {
                                const succes_embed = embedGen(
                                    itemSelect,
                                    craft,
                                    inventory,
                                    interaction,
                                    Colors.Green,
                                    client
                                );
                                const objMess = {
                                    content: "Chế tạo thành công!",
                                    embeds: [succes_embed],
                                    components: [
                                        returnSelectMenu(
                                            "craft_select_cate",
                                            listCate,
                                            returnData.bind(null, true),
                                            listCate.indexOf(cate2)
                                        ),
                                        returnSelectMenu(
                                            `craft_select_item`,
                                            items,
                                            returnData2.bind(null, cate2),
                                            items.indexOf(itemSelect)
                                        ),
                                        genButtonCreates(
                                            inventory,
                                            itemSelect,
                                            craft
                                        ),
                                    ],
                                };
                                await interaction.editReply(objMess);
                            } else {
                                const fail_embed = embedGen(
                                    itemSelect,
                                    craft,
                                    inventory,
                                    interaction,
                                    Colors.Red,
                                    client
                                );
                                await interaction.editReply({
                                    content: "Chế tạo thất bại!",
                                    embeds: [fail_embed],
                                    components: [
                                        returnSelectMenu(
                                            "craft_select_cate",
                                            listCate,
                                            returnData.bind(null, true),
                                            listCate.indexOf(cate2)
                                        ),
                                        returnSelectMenu(
                                            `craft_select_item`,
                                            items,
                                            returnData2.bind(null, cate2),
                                            items.indexOf(itemSelect)
                                        ),
                                        genButtonCreates(
                                            inventory,
                                            itemSelect,
                                            craft
                                        ),
                                    ],
                                });

                            }
                        })
                        .on("end", async (collected) => {
                            return;
                        });
                }
            })
            .on("end", async (collected) => {
                return;
            });
    },
} as TSlashCommand;

function embedGen(
    itemSelect: TItem,
    craft: Craft,
    inventory: Inventory,
    interaction: CommandInteraction,
    color: ColorResolvable,
    client: NullClient
) {
    const embed = new EmbedBuilder()
        .setTitle(
            "Chế tạo vật phẩm: " + itemSelect.emoji + " " + itemSelect.name
        )
        .setDescription(itemSelect.description)
        .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
        })
        .setColor(Colors.Blue)
        .setFooter({
            text: "Crafing Beta",
        })
        .addFields([
            {
                name: "Yêu cầu: ",
                value: `${itemSelect.craft?.materials
                    ?.map((item) => {
                        return `${
                            craft.enoughMaterial(inventory, item)
                                ? client.emoji.yes
                                : client.emoji.no
                        } ${
                            craft.findItemById(item.id)?.emoji
                        } \`${inventory.getItemAmount(item.id)}/${
                            item.amount
                        }\` ${craft.findItemById(item.id)?.name}`;
                    })
                    .join("\n")}`,
            },
            {
                name: "Kết quả: ",
                value: `x1: ${itemSelect.craft.amout} \nx${craft.maxCraft(
                    inventory,
                    itemSelect
                )}: ${
                    (itemSelect.craft.amout ?? 1) *
                    craft.maxCraft(inventory, itemSelect)
                }`,
            },
        ])
        .setTimestamp()
        .setColor(color);
    return embed;
}

function genButtonCreates(inventory: Inventory, item: TItem, craft: Craft) {
    const maxCraft = craft.maxCraft(inventory, item);
    const craftOne = new ButtonBuilder()
        .setCustomId(`craft_button_${item.id}_1`)
        .setLabel("x1")
        .setDisabled(!craft.canCraft(inventory, item))
        .setStyle(ButtonStyle.Primary);
    const craftAll = new ButtonBuilder()
        .setCustomId(`craft_button_${item.id}_${maxCraft}`)
        .setLabel(`x${maxCraft}`)
        .setDisabled(!craft.canCraft(inventory, item, maxCraft))
        .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        craftOne,
        craftAll,
    ]);
    return row;
}

function returnSelectMenu(
    customId: string,
    value: string[] | TItem[],
    selectOption: (o: string | TItem) => {
        label: string;
        value: string;
        description?: string;
        emoji?: string;
        default?: boolean;
    },
    index?: number,
    min = 1,
    max = 1
) {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setMinValues(min)
        .setMaxValues(max)
        .addOptions(
            value.map((item, i) => {
                const data = selectOption(item);
                if (i === index) {
                    data.default = true;
                }
                return data;
            })
        );
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu
    );
}
