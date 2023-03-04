import { Database } from "quickmongo";

export class Premium {
    // eslint-disable-next-line no-empty-function
    constructor(protected db: Database) {}

    async func(id: string, guildsOrUsers: "guilds" | "users") {
        const data: Plan = await this.db.get(`${guildsOrUsers}.${id}.premium`);
        return {
            check: () => {
                if (!data) return false;
                return data.date > Date.now();
            },
            set: async (type: string, date: number) => {
                await this.db.set(`${guildsOrUsers}.${id}.premium`, {
                    type,
                    date,
                }, Date.now() - date);
            },
            extend: async (date: number) => {
                await this.db.set(`${guildsOrUsers}.${id}.premium`, {
                    date: data.date + date,
                }, Date.now() - (data.date + date));
            },
        };
    }


    patchData(data: Plan) {
        return {
            type: data.type,
            date: data.date,
        };
    }

}

interface Plan {
    type: string;
    date: number;
}
