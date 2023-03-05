import { ERarities, TItems, EItemTypes } from '../../types/index';
export const Items: TItems = {
    "1": {
        name: "Wooden Sword",
        description: "A wooden sword",
        type: EItemTypes.WEAPON,
        rarity: ERarities.COMMON,
        stats: {
            attack: 1,
        },
    },
};
