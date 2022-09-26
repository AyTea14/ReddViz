import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { nRandomPostsFromSub } from "./nRandomPostsFromSub.js";
import { oneRandomMeme } from "./oneRandomMeme.js";
import { subredditOrCount } from "./subredditOrCount.js";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { formatJSON } from "#functions";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [new RewriteFrames({ root: global.__dirname })],
});

export async function gimmeRoutes(fastify: FastifyInstance): Promise<void> {
    if (!fastify.hasReplyDecorator("json")) fastify.decorateReply("json", formatJSON);

    fastify
        .addHook("preHandler", async (_, reply) => {
            reply.type("application/json");
        })
        .route({ url: "/", method: "GET", handler: oneRandomMeme })
        .route({ url: "/:interface", method: "GET", handler: subredditOrCount })
        .route({ url: "/:interface/:count", method: "GET", handler: nRandomPostsFromSub });
}

export function homePage(_res: FastifyRequest, reply: FastifyReply) {
    reply.send(
        "Welcome to MemeAPI! For documentation and info go to https://github.com/AyTea14/MemeApiTS and if you want to use it, just add /gimme at the end of the url"
    );
}
