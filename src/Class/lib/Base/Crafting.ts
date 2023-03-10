import { Base } from "./Base";
import { BaseInventory } from "./BaseInventory";
import { TItem } from "../types/";
import { EmbedBuilder } from "discord.js";
import { Items, Materials } from "../Constants/Items";
import { emojis } from "../../../utils/constants";
import { covertToSmallNumber } from "../../../utils/functions";
import _ from "lodash";
export abstract class CraftItem extends Base {
    canCraft(inventory: BaseInventory, item: TItem): boolean {
        if (!item.craft.canCraft) return false;
        if (!item.craft.materials) return false;
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
            return inventory.addItem(item.id, 1);
        }
        return false;
    }

    show() {
        const list = this.getListItems;
        const fields = list.map((item) => this.generateField(item));
        const embed = new EmbedBuilder().addFields(_.chunk(fields, 24)[0]);
        return embed;
    }

    get getListItems() {
        return Object.values(Items).filter((item) => item.craft.canCraft);
    }

    generateField(item: TItem) {
        const biggestAmount = Math.max(
            ...(item.craft.materials?.map((material) => material.amount) ?? [])
        );
        return {
            name: `${
                emojis[item.name as keyof typeof emojis] ?? emojis.unknown
            } ${item.name}`,
            value: `Yêu cầu: ${item.craft.materials
                ?.map(
                    (material) =>
                        `${
                            emojis[
                                Object.values(Materials).find(
                                    (v) => {
                                        return v.id === material.id;
                                    }
                                )?.name.toLowerCase() as keyof typeof emojis
                            ] ?? emojis.unknown
                        }${covertToSmallNumber(
                            material.amount,
                            biggestAmount.toString().length
                        )}`
                )
                .join(" ")}`,
            inline: true,
        };
    }
}
