import {
    MessagePayload,
    WebhookClient,
    WebhookCreateMessageOptions,
} from "discord.js";

export const sendWH = (
    options: string | MessagePayload | WebhookCreateMessageOptions,
) => {
    return new WebhookClient({ url: process.env.webhook || 'no' }).send(options);
};
