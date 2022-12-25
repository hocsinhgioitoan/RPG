import { ClientEvents } from "discord.js";
import NullClient from '../Class/Client';

export type events = keyof ClientEvents;
export interface TEvent<key extends events> {
    name: key;
    once?: boolean;
    run: (client: NullClient,...args: ClientEvents[key]) => void;
}