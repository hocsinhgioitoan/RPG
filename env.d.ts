declare global {
    namespace NodeJS {
        interface ProcessEnv {
            local_token?: string;
            host_token?: string;
            local_mongo?: string;
            host_mongo?: string;
            local_webhook?: string;
            host_webhook?: string;
            // local or host
            mode?: "local" | "host";
            devGuild?: string;
        }
    }
}

export {};
