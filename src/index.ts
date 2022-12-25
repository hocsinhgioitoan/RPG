// Import 

// Env
import { config } from "dotenv";
config();
if (!process.env.mode) process.env.mode = "local";
// Build Bot
import('./Class/Client').then((file) => new file.default().build(process.env[`${process.env.mode}_token`]!));
