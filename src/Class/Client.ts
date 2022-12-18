// Import.
import { Client, GatewayIntentBits as intent, Colors } from "discord.js";
import * as func from "../utils/functions";
// Export Client
export default class NullClient extends Client {
    funcs: typeof func = func;
    constructor() {
        super({
            intents: [intent.GuildMembers, intent.Guilds],
        });
    }

    build(token?: string) {
        this.login(token).catch(() => {
            return this.funcs.sendWH({
                embeds: [
                    {
                        description: "Token lỗi vui lòng kiểm tra",
                        color: Colors.Red,
                    },
                ],
            });
        });
    }
}
