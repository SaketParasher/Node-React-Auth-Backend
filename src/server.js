// import app from "./app.js";
import { config } from 'dotenv';
import { getSessionSecret } from "./config/parameterStore.js";

config()

async function startServer() {
    try {
        if (process.env.NODE_ENV === "production") {
            process.env.SESSION_SECRET = await getSessionSecret();
        }

        const { default: app } = await import("./app.js");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();