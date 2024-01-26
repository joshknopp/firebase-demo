import { api } from "@nitric/sdk";
import { CorsService } from "../services/cors.service";

const cors = CorsService.getCorsConfig();
const helloApi = api('main', {
  middleware: [cors],
});

helloApi.get("/health", async (ctx) => {
    ctx.res.status = 200;
    ctx.res.json(`ack`);

    return ctx;
});

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

helloApi.get("/secure", async (ctx) => {
    const authorizationHeader = ctx.req.headers.authorization;

    if (!authorizationHeader) {
        ctx.res.status = 403;
        ctx.res.json('Unauthorized no header');
        return ctx;
    }

    const token = Array.isArray(authorizationHeader)
        ? authorizationHeader[0]  // If it's an array, use the first element
        : authorizationHeader;    // If it's a string, use the original string

    try {
        // Verify the Firebase Authentication token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);

        // If verification is successful, return the user ID
        ctx.res.status = 200;
        ctx.res.json({ userId: decodedToken.uid });
    } catch (error) {
        // If verification fails, return a 403 error
        ctx.res.status = 403;
        ctx.res.json({error, token});
    }

    return ctx;
});
