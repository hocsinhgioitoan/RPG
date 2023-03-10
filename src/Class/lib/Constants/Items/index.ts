import { ERarities, TItems, EItemTypes } from "../../types/index";
// eslint-disable-next-line no-shadow
export enum MaterialIDs {
    WOOD = 1000,
    STICK = 1001,
}
// eslint-disable-next-line no-shadow
export enum ItemIDs {
    WOODEN_SWORD = 1,
}

export const Items: TItems = {
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
                    id: MaterialIDs.WOOD,
                    amount: 3,
                },
                {
                    id: MaterialIDs.STICK,
                    amount: 2,
                },
            ],
        },
    },
};

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
    [MaterialIDs.STICK]: {
        id: MaterialIDs.STICK,
        name: "Stick",
        description: "A stick",
        type: EItemTypes.MATERIAL,
        rarity: ERarities.COMMON,
    },
};
