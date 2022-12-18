// Import 

// Env
import { config } from "dotenv";
config();

// Build Bot
import('./Class/Client').then((file) => new file.default().build(process.env.token))