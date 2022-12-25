import { TEvent } from "../typings";
import NullClient from "../Class/Client";
export default {
    name: "ready",
    once: true,
    run: (client: NullClient<true>) => {
        console.log(`Logged in as ${client.user?.tag}!`);
    }
} as TEvent<"ready">;