import { TSlashCommand, TSlashCommandType } from "../../typings";
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Craft } from "../../Class/lib";
import _ from "lodash";
import { Pagination } from "pagination.djs";
export default {
    name: "craft",
    description: "Chế tạo vật phẩm",
    type: TSlashCommandType.RPG,
    data: new SlashCommandBuilder(),
    async run(client, interaction) {
        const craft = new Craft();
        const items = craft.getListItems;
        const fields = items.map((item) => craft.generateField(item));
        const _fields = _.chunk(fields, 24);
        const embeds: EmbedBuilder[] = [];
        for (const field of _fields) {
            const embed = new EmbedBuilder().addFields(field);
            embeds.push(embed);
        }
        embeds.splice(0, 1, craft.show());
        const page = new Pagination(interaction);
        page.setEmbeds(embeds);
        await page.reply();
    },
} as TSlashCommand;
