import { EmojiResolvable } from "discord.js";
import { Armor, Pet, Skill, Weapon } from "../Base";

export interface TPlayerData {
    name: string;
    id: string;
    attack: number;
    hp: number;
    armor: number;
    critChance: number;
    critDamage: number;
    equippedArmors: Armor[];
    equippedWeapons: Weapon[];
    skill?: Skill;
    pet?: Pet;
    imageUrl?: string;
}

export interface TItemData {
    id: number;
    amount: number;
}

export interface TItems {
    [key: string]: TItem;
}

export interface TItem {
    name: string;
    description: string;
    type: EItemTypes | string;
    rarity: ERarities | string;
    stats: TItemStats;
    emoji?: EmojiResolvable
}

// eslint-disable-next-line no-shadow
export enum EItemTypes {
    WEAPON = "weapon",
    ARMOR = "armor",
}

// eslint-disable-next-line no-shadow
export enum ERarities {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
}

export interface TItemStats {
    attack?: number;
    armor?: number;
}
