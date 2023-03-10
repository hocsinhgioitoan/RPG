import { BaseInventory } from "../Base";
import { TItemData } from "../types";

export class Inventory extends BaseInventory {
    data: TItemData[];
    name = "Inventory";
    id = "inventory";
    constructor(data: TItemData[]) {
        super();
        this.data = data;
    }
}
