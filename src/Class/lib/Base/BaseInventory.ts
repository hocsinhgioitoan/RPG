import { Base } from "./Base";
import { EmbedBuilder, Colors } from "discord.js";
import { TItemData } from "../types";
import _ from "lodash";
import { padNumber, covertToSmallNumber } from "../../../utils/functions";
import { Items } from "../Constants/Items";
import { emojis } from "../../../utils/constants";
export abstract class BaseInventory extends Base {
    abstract data: TItemData[];
    show() {
        this.data = this.data ?? [];
        const embed = new EmbedBuilder()
            .setTimestamp()
            .setTitle("Inventory")
            .setColor(Colors.Blue);
        const items = _.chunk(this.data, 5);
        const biggestID = Math.max(...this.data.map((x) => x.id)) ?? 0;
        const biggestAmount = Math.max(...this.data.map((x) => x.amount)) ?? 0;
        const str = items
            .map((x) => {
                return x
                    .map((y) => {
                        const item = Object.values(Items).find(
                            (_x) => _x.id === y.id
                        );
                        if (!item) return "";
                        return `\`${padNumber(
                            y.id,
                            biggestID.toString().length
                        )}\` ${
                            item.emoji ?? emojis[item.name as keyof typeof emojis] ?? emojis.unknown
                        } ${covertToSmallNumber(
                            y.amount,
                            biggestAmount.toString().length
                        )}`;
                    })
                    .join("  ");
            })
            .join("\n");
        embed.setDescription(str || "No items");
        return embed;
    }

    getItemAmount(id: number): number {
        for (const item of this.data) {
            if (item.id === id) {
                return item.amount;
            }
        }
        return 0;
    }

    addItem(id: number, amount: number) {
        for (const item of this.data) {
            if (item.id === id) {
                item.amount += amount;
            }
        }
        if (this.data.find((x) => x.id === id)) return this.data;
        this.data.push({ id, amount });
        return this.data;
    }

    removeItem(id: number, amount: number) {
        for (const item of this.data) {
            if (item.id === id) {
                item.amount -= amount;
                if (item.amount <= 0) {
                    this.data.splice(this.data.indexOf(item), 1);
                }
                return;
            }
        }
        return this.data;
    }
}
