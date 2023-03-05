import { TEvent } from "../typings";
import NullClient from "../Class/Client";
import { ActivityType } from "discord.js";
export default {
    name: "ready",
    once: true,
    run: async (client: NullClient<true>) => {
        await client.loadSlashCommands();
        await client.loadInteractions();
        console.log(`Logged in as ${client.user?.tag}!`);

        client.user?.setPresence({
            activities: [
                {
                    name: "/menu",
                    type: ActivityType.Listening,
                },
            ],
            status: "online",
        });
    },
} as TEvent<"ready">;
