import { TPlayerData } from "../types";
import { Fighter } from "../Base";

export class BaseFighter extends Fighter {
    constructor({
        hp = 100,
        id,
        attack = 10,
        name,
        armor = 0.1,
        critChance = 0.3,
        critDamage = 1.2,
        skill,
        pet,
        imageUrl,
        hasPremium = false,
    }: TPlayerData) {
        super(name);
        super.hp = hp;
        super.id = id;
        super.attack = attack;
        super.name = name;
        super.armor = armor;
        super.critChance = critChance;
        super.critDamage = critDamage;
        super.skill = skill;
        super.pet = pet;
        super.imageUrl = imageUrl;
        super.hasPremium = hasPremium;
    }
}
