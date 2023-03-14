import {
    ButtonBuilder,
    EmojiResolvable,
    MessagePayload,
    WebhookClient,
    WebhookMessageCreateOptions,
} from "discord.js";
import { smallNum } from "./constants";

export const sendWH = (
    options: string | MessagePayload | WebhookMessageCreateOptions,
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

export function disableButton(button: ButtonBuilder) {
    const _b = ButtonBuilder.from(button);
    _b.setDisabled(true);
    return _b;
}

export function parseEmoji(emoji: EmojiResolvable) {
    const match = (emoji as string).match(
        /<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/
    );
    return {
        animated: Boolean(match?.[1]),
        name: match?.[2],
        id: match?.[3],
    };
}
