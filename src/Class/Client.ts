// Import.
import { Client, GatewayIntentBits as intent, Colors } from "discord.js";
import * as func from "../utils/functions";
import { Database } from "quickmongo";
// Export Client
export default class NullClient extends Client {
    funcs: typeof func = func;
    db!: Database;
    constructor() {
        super({
            intents: [intent.GuildMembers, intent.Guilds],
        });
    }

    async  build(token?: string) {
        await this.loadDatabase();
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

    async loadDatabase() {
        const db = new Database(process.env.mongo!);
        db.on("ready", (_db) => {
            this.funcs.sendWH({
                embeds: [
                    {
                        description: "Kết nối database thành công",
                        color: Colors.Green,
                    },
                ],
            });
            this.db = _db;
        });
        db.on("error", () => {
            this.funcs.sendWH({
                embeds: [
                    {
                        description: "Kết nối database thất bại",
                        color: Colors.Red,
                    },
                ],
            });
        });

        db.connect();
        return true
    }
}
