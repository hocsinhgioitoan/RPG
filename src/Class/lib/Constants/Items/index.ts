import { emojis } from "../../../../utils/constants";
import { ERarities, TItems, EItemTypes } from "../../types/index";
// eslint-disable-next-line no-shadow
export enum MaterialIDs {
    WOOD = 1000,
    PLANK = 1001,
    STICK = 1002,
}
// eslint-disable-next-line no-shadow
export enum ItemIDs {
    WOODEN_SWORD = 1,
    PLANK = 2,
    STICK = 3,
}

export const Materials: {
    [key in MaterialIDs]: {
        id: MaterialIDs;
        name: string;
        description: string;
        type: EItemTypes;
        rarity: ERarities;
    };
} = {
    [MaterialIDs.WOOD]: {
        id: MaterialIDs.WOOD,
        name: "Wood",
        description: "A piece of wood",
        type: EItemTypes.MATERIAL,
        rarity: ERarities.COMMON,
    },
    [MaterialIDs.PLANK]: {
        id: MaterialIDs.PLANK,
        name: "Plank",
        description: "A plank",
        type: EItemTypes.MATERIAL,
        rarity: ERarities.COMMON,
    },
    [MaterialIDs.STICK]: {
        id: MaterialIDs.STICK,
        name: "Stick",
        description: "A stick",
        type: EItemTypes.MATERIAL,
        rarity: ERarities.COMMON,
    },
};


export const Items: TItems = {
    [ItemIDs.PLANK]: {
        ...Materials[MaterialIDs.PLANK],
        stats: {},
        craft: {
            canCraft: true,
            materials: [
                {
                    id: MaterialIDs.WOOD,
                    amount: 1,
                }
            ],
            amout: 4,
        },
        emoji: emojis.plank,
    },
    [ItemIDs.STICK]: {
        ...Materials[MaterialIDs.STICK],
        stats: {},
        craft: {
            canCraft: true,
            materials: [
                {
                    id: MaterialIDs.PLANK,
                    amount: 1,
                }
            ],
            amout: 2,
        },
        emoji: emojis.stick,
    },
    [ItemIDs.WOODEN_SWORD]: {
        id: ItemIDs.WOODEN_SWORD,
        name: "Wooden Sword",
        description: "A wooden sword",
        type: EItemTypes.WEAPON,
        rarity: ERarities.COMMON,
        stats: {
            attack: 1,
        },
        craft: {
            canCraft: true,
            materials: [
                {
                    id: MaterialIDs.PLANK,
                    amount: 2,
                },
                {
                    id: MaterialIDs.STICK,
                    amount: 1,
                },
            ],
            amout: 1,
        },
        emoji: emojis.wooden_sword,
    },
};

