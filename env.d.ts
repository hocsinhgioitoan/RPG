declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token?: string;
            webhook?: string;
            mongo?: string;
        }
    }
}

export {};