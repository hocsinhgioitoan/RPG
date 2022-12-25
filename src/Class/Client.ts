// Import.
import {
    Client,
    GatewayIntentBits as intent,
    Colors,
    Collection,
} from "discord.js";
import * as func from "../utils/functions";
import { Database } from "quickmongo";
import { readdirSync } from "fs";
import { join } from "path";
import { TEvent, TSlashCommand, events } from "../typings";
// Export Client
export default class NullClient<
    Ready extends boolean = boolean
> extends Client<Ready> {
    funcs: typeof func = func;
    db!: Database;
    commands: Collection<string, TSlashCommand> = new Collection();
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

    async loadCommands() {
        const folders = readdirSync(join(__dirname, "..", "Commands"));
        for (const folder of folders) {
            const commands = readdirSync(
                join(__dirname, "..", "Commands", folder)
            );
            for (const command of commands) {
                const { default: Command }: { default: TSlashCommand } =
                    await import(
                        join(__dirname, "..", "Commands", folder, command)
                    );
                this.commands.set(Command.name, Command);
                console.log(`Loaded ${Command.name} command`);
            }
        }
        console.log("Done loading commands!");
        return true;
    }

    async loadSlashCommands() {
        await this.loadCommands();
        this.guilds.cache
            .get(process.env.devGuild!)
            ?.commands.set(
                this.commands.map((command) =>
                    command.data
                        .setName(command.name)
                        .setDescription(command.description)
                        .toJSON()
                )
            );
        console.log("Done loading slash commands!");
        return true;
    }
}
