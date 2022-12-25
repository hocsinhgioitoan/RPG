import { Database } from "quickmongo";

export class Premium {
    constructor(protected db: Database) {}

    async func(id: string, guildsOrUsers: "guilds" | "users") {
        const data: plan = await this.db.get(`${guildsOrUsers}.${id}.premium`);
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


    patchData(data: plan) {
        return {
            type: data.type,
            date: data.date,
        };
    }

}

interface plan {
    type: string;
    date: number;
}


