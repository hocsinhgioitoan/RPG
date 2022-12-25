import { AutocompleteInteraction, ChatInputCommandInteraction, ClientEvents, ModalSubmitInteraction, SlashCommandBuilder} from "discord.js";
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
    type: TSlashCommandType;
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    run: (client: NullClient, interaction: ChatInputCommandInteraction<'cached'>) => void;
    autocomplete?: (client: NullClient, interaction: AutocompleteInteraction<'cached'>) => void;
}

export interface TInteraction<T> {
    name: string;
    run: (client: NullClient, interaction: T) => void;
}
export enum TSlashCommandType {
    INFO = 'info',
    MISC = 'misc',
}
