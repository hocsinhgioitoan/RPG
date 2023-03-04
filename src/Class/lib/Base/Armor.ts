import { EmbedBuilder } from "discord.js";
import { Base } from "./Base";
import { Player } from "./Player";
import { formatPercent, inlineCode, SILVER } from "./utils";

export abstract class Armor extends Base {
    /** References Player who owns this armor */
    owner?: Player;
    /** Armor image */
    imageUrl?: string;
    /**
     * Armor's effectiveness in the form of percentage.
     * The percentage represents how much of damage will be blocked when opponent
     * attacks you.
     * */
    armor = 0.05;

    /** MessageEmbed that represents Armor */
    show() {
        const armorRate = formatPercent(this.armor);

        const embed = new EmbedBuilder()
            .setTitle("Armor")
            .setColor(SILVER)
            .setFields([
                { name: "Name", value: this.name, inline: true },
                { name: "Armor", value: inlineCode(armorRate), inline: true },
            ]);

        if (this.imageUrl) embed.setThumbnail(this.imageUrl);

        return embed;
    }
}
