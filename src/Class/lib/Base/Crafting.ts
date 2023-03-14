import { Base } from "./Base";
import { BaseInventory } from "./BaseInventory";
import { TItem } from "../types/";
import { EmbedBuilder } from "discord.js";
import { Items } from "../Constants/Items";
export class CraftItem extends Base {
    name = "Crafting";
    id = "craft";
    canCraft(inventory: BaseInventory, item: TItem, amout = 1): boolean {
        if (!item?.craft?.canCraft) return false;
        if (!item.craft?.materials) return false;
        if (amout > this.maxCraft(inventory, item)) return false;
        for (const material of item.craft.materials) {
            if (!this.enoughMaterial(inventory, material)) return false;
        }
        return true;
    }

    craft(inventory: BaseInventory, item: TItem, amout = 1) {
        if (!item.craft?.materials) return false;
        if (this.canCraft(inventory, item, amout)) {
            for (const material of item.craft.materials) {
                inventory.removeItem(material.id, material.amount * amout);
            }
            inventory.addItem(item.id, (item.craft?.amout ?? 1) * amout);
            return true;
        }
        return false;
    }

    show() {
        const embed = new EmbedBuilder();
        return embed;
    }

    get getListItems() {
        return Object.values(Items).filter((item) => item.craft.canCraft);
    }

    findItemByName(name: string) {
        return Object.values(Items).find((item) => item.name === name);
    }

    findItemById(id: number) {
        return Object.values(Items).find((item) => item.id === id);
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

    maxCraft(inventory: BaseInventory, _item: TItem) {
        if (!_item.craft.materials) return 0;
        let max = Infinity;
        for (const material of _item.craft.materials) {
            const items = inventory.data;
            const item = items.find((__item) => __item.id === material.id);
            if (!item) return 0;
            if (item.amount < material.amount) return 0;
            const amount = Math.floor(item.amount / material.amount);
            if (amount < max) max = amount;
        }
        return max;
    }
}
