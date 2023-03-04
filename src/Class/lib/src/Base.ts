import { EmbedBuilder } from "discord.js";

export abstract class Base {
    abstract name: string;
    abstract id: string;
    abstract show(): EmbedBuilder;
}
