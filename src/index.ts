// Import

// Env
import { config } from "dotenv";
import express from "express";
config();
if (!process.env.mode) process.env.mode = "local";
// Build Bot
import("./Class/Client").then((file) =>
    new file.default().build(process.env[`${process.env.mode}_token`]!)
);

if (process.env.mode === "host") {
    const app = express();
    app.get("/", (req, res) => {
        res.send("Hello World!");
    });
    app.listen(3000, () => {
        console.log("Example app listening on port 3000!");
    });
}
