// Import.
import { Client, GatewayIntentBits as intent, Colors } from "discord.js";
import * as func from "../utils/functions";
import { Database } from "quickmongo";
import { readdirSync } from "fs";
import { join } from "path";
import { TEvent, events } from "../typings";
// Export Client
export default class NullClient<
    Ready extends boolean = boolean
> extends Client<Ready> {
    funcs: typeof func = func;
    db!: Database;
    constructor() {
        super({
            intents: [intent.GuildMembers, intent.Guilds],
        });
    }

    async build(token?: string) {
        await this.loadDatabase();
        await this.loadEvents();
        this.login(token)
            .catch(() => {
                return this.funcs.sendWH({
                    embeds: [
                        {
                            description: "Token lỗi vui lòng kiểm tra",
                            color: Colors.Red,
                        },
                    ],
                });
            })
            .then(() => {
                return this.funcs.sendWH({
                    embeds: [
                        {
                            description: "Đăng nhập thành công",
                            color: Colors.Green,
                        },
                    ],
                });
            });
    }

    async loadDatabase() {
        const db = new Database(process.env[`${process.env.mode}_mongo`]!);
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
        return true;
    }

    async loadEvents() {
        const events = readdirSync(join(__dirname, "..", "Events"));
        for (const event of events) {
            const { default: Event }: { default: TEvent<events> } =
                await import(join(__dirname, "..", "Events", event));
            this[Event.once ? "once" : "on"](
                Event.name,
                Event.run.bind(null, this)
            );
            console.log(`Loaded ${Event.name} event`);
        }
        console.log("Done loading events!");
        return true;
    }
}
