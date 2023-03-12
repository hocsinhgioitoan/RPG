import { Base } from "./Base";
import { BaseInventory } from "./BaseInventory";
import { TItem } from "../types/";
import { EmbedBuilder } from "discord.js";
import { Items, Materials } from "../Constants/Items";
import { emojis } from "../../../utils/constants";
import { covertToSmallNumber } from "../../../utils/functions";
import _ from "lodash";
import { Inventory } from "../Extend/Inventory";
export class CraftItem extends Base {
    name = "Crafting";
    id = "craft";
    canCraft(inventory: BaseInventory, item: TItem): boolean {
        if (!item?.craft?.canCraft) return false;
        if (!item.craft?.materials) return false;
        for (const require of item.craft.materials) {
            if (inventory.getItemAmount(require.id) < require.amount) {
                return false;
            }
        }
        return true;
    }

    craft(inventory: BaseInventory, item: TItem) {
        if (this.canCraft(inventory, item)) {
            if (!item.craft.materials) return false;
            for (const require of item.craft.materials) {
                inventory.removeItem(require.id, require.amount);
            }
            return inventory.addItem(item.id, item.craft.amout ?? 1);
        }
        return false;
    }

    show(inventory?: Inventory) {
        if (!inventory) {
            return new EmbedBuilder().setDescription("No inventory");
        }
        const list = this.getListItems;
        const fields = list.map((item) => this.generateField(item, inventory));
        const embed = new EmbedBuilder().setDescription(_.chunk(fields, 24)[0].join("\n"));
        return embed;
    }

    get getListItems() {
        return Object.values(Items).filter((item) => item.craft.canCraft);
    }

    generateField(item: TItem, inventory: Inventory) {
        const biggestAmount = Math.max(
            ...(item.craft.materials?.map((material) => material.amount) ?? [])
        );
        return `${
            emojis[
                item.name
                    .split(" ")
                    .join("_")
                    .toLowerCase() as keyof typeof emojis
            ] ?? emojis.unknown
        } ${item.name}: ${item.craft.materials
            ?.map(
                (material) =>
                    `${
                        this.enoughMaterial(inventory, material)
                            ? emojis.yes
                            : emojis.no
                    } ${
                        emojis[
                            Object.values(Materials)
                                .find((v) => {
                                    return v.id === material.id;
                                })
                                ?.name.toLowerCase() as keyof typeof emojis
                        ] ?? emojis.unknown
                    }${covertToSmallNumber(
                        material.amount,
                        biggestAmount.toString().length
                    )}`
            )
            .join(" ")}`;
    }

    findItemByName(name: string) {
        return Object.values(Items).find((item) => item.name === name);
    }

    enoughMaterial(
        inventory: BaseInventory,
        material: {
            id: number;
            amount: number;
        }
    ) {
        const items = inventory.data;
        const item = items.find((_item) => _item.id === material.id);
        if (!item) return false;
        if (item.amount < material.amount) return false;
        return true;
    }
}
