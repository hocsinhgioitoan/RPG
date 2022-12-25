import { TEvent } from "../typings";
import NullClient from "../Class/Client";
export default {
    name: "ready",
    once: true,
    run: async (client: NullClient<true>) => {
        await client.loadSlashCommands();
        await client.loadInteractions();
        console.log(`Logged in as ${client.user?.tag}!`);

        await check(client);
    },
} as TEvent<"ready">;

const check = async (client: NullClient<true>) => {
    // check premium

    // guilds
    const guilds = client.guilds.cache;
    for (const guild of guilds) {
        const premium = await client.premium.func(guild[0], "guilds");
        if (!premium.check()) {
            guild[1].fetchOwner().then(async (owner) => {
                owner.send(
                    `Your guild **${guild[1].name}** has expired premium!`,
                );
            });
        }
    }

    // users
    const users = client.users.cache;
    for (const user of users) {
        const premium = await client.premium.func(user[0], "users");
        if (!premium.check()) {
            user[1].send(`Your premium has expired!`);
        }
    }
};
