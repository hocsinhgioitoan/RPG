// Import.
import { Client, GatewayIntentBits as intent } from "discord.js";

// Export Client
export default class NullClient extends Client {
    constructor() {
        super({
            intents: [intent.GuildMembers, intent.Guilds],
        });
    }
}
