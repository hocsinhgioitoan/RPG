import {
    MessagePayload,
    WebhookClient,
    WebhookCreateMessageOptions,
} from "discord.js";

export const sendWH = (
    options: string | MessagePayload | WebhookCreateMessageOptions, link?: string
) => {
    return new WebhookClient({
        url: link ? link : process.env[`${process.env.mode}_webhook`]!,
    }).send(options);
};
