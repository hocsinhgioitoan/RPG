declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token?: string;
            webhook?: string;
        }
    }
}

export {};