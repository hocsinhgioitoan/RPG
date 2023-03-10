import { EmbedBuilder } from "discord.js";
import { Armor } from "./Armor";
import { Base } from "./Base";
import { Pet } from "./Pet";
import { Skill } from "./Skill";
import { formatPercent, GOLD, inlineCode, random } from "./utils";
import { Weapon } from "./Weapon";
import { emojis } from "../../../utils/constants";
/**
 * Fighter is base class to be used in Battle. Only class derived from Fighter
 * can be used in Battle.
 *
 * ```typescript
 * class Monster extends Fighter {
 *    name = "boogy man";
 *    id = "boogy_man";
 *    attack = 20;
 * }
 * ```
 * */
export class Fighter extends Base {
    /** Fighter name */
    name: string;
    /** Fighter unique id */
    id: string;
    /** Damage dealt when attack */
    attack = 10;
    /** Fighter's health point */
    hp = 100;
    /** Amount of damage blocked when Fighter gets attacked*/
    armor = 0.1;
    /** Percentage to get critical attack */
    critChance = 0.3;
    /** Critical attack percentage increment */
    critDamage = 1.2;
    /** Array of equipped armors */
    equippedArmors: Armor[] = [];
    /** Array of equipped weapons */
    equippedWeapons: Weapon[] = [];
    /** Fighter's Skill */
    skill?: Skill;
    /** Fighter's Pet */
    pet?: Pet;
    /** Image to represent this Fighter */
    imageUrl?: string;

    hasPremium = false;
    constructor(name: string) {
        super();
        this.name = name;
        this.id = name;
    }

    /** Add new armor to the user */
    equipArmor(armor: Armor) {
        this.armor += armor.armor;
        this.equippedArmors.push(armor);
    }

    /** Add new weapon to the user */
    equipWeapon(weapon: Weapon) {
        this.attack += weapon.attack;
        this.equippedWeapons.push(weapon);
    }

    /** Returns true if critical attack */
    isCrit() {
        return random.bool(this.critChance);
    }

    /**
     * MessageEmbed that represents this Fighter. Passing another Fighter in this
     * method will make comparison between this Fighter stat with the other
     * */
    show() {
        const armor = formatPercent(this.armor);
        const critChance = formatPercent(this.critChance);

        const armorList = this.equippedArmors
            .map((x, i) => `${i + 1}. ${x.name}`)
            .join("\n");

        const weaponList = this.equippedWeapons
            .map((x, i) => `${i + 1}. ${x.name}`)
            .join("\n");

        const none = emojis.no;
        const embed = new EmbedBuilder()
            .setTitle(`H??? s??: ${this.name}`)
            .setColor(GOLD)
            .setFields([
                { name: "T??n", value: this.name },
                {
                    name: "Ch??? s???",
                    value: `${emojis.health} ${inlineCode(
                        this.hp.toString()
                    )} ${emojis.attack} ${inlineCode(this.attack.toString())} ${
                        emojis.shield
                    } ${inlineCode(armor)} ${emojis.critical} ${inlineCode(
                        critChance
                    )}
                    `,
                },
                {
                    name: "K?? n??ng",
                    value: this.skill?.name || none,
                    inline: true,
                },
                { name: "Gi??p", value: armorList || none, inline: true },
                { name: "V?? kh??", value: weaponList || none, inline: true },
                { name: "Th?? c??ng", value: this.pet?.name || none },

                { name: "Premium", value: this.hasPremium ? emojis.yes : none },
            ]);

        if (this.imageUrl) embed.setThumbnail(this.imageUrl);

        return embed;
    }
}
