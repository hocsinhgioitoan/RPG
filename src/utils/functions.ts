import {
    MessagePayload,
    WebhookClient,
    WebhookCreateMessageOptions,
} from "discord.js";
import { smallNum } from "./constants";

export const sendWH = (
    options: string | MessagePayload | WebhookCreateMessageOptions,
    link?: string
) => {
    return new WebhookClient({
        url: link ? link : process.env[`${process.env.mode}_webhook`]!,
    }).send(options);
};

export const padNumber = (num: number, size: number) => {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

export const covertToSmallNumber = (count: number, digits: number) => {
    let result = "";
    for (let i = 0; i < digits; i++) {
        const digit = count % 10;
        count = Math.trunc(count / 10);
        result = smallNum[digit] + result;
    }
    return result;
};
