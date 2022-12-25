import { ChatInputCommandInteraction, ClientEvents, SlashCommandBuilder} from "discord.js";
import NullClient from '../Class/Client';

export type events = keyof ClientEvents;
export interface TEvent<key extends events> {
    name: key;
    once?: boolean;
    run: (client: NullClient,...args: ClientEvents[key]) => void;
}

export interface TSlashCommand {
    name: string;
    description: string;
    data: SlashCommandBuilder;
    run: (client: NullClient, interaction: ChatInputCommandInteraction<'cached'>) => void;
}
