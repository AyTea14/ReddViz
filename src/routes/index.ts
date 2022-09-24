import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { nRandomPostsFromSub } from "./nRandomPostsFromSub.js";
import { oneRandomMeme } from "./oneRandomMeme.js";
import { subredditOrCount } from "./subredditOrCount.js";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { coloredMethod, coloredStatusCode, formatJSON } from "#functions";
import { logger } from "#root/index";
import prettyMs from "pretty-ms";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [new RewriteFrames({ root: global.__dirname })],
});

export async function gimmeRoutes(fastify: FastifyInstance): Promise<void> {
    if (!fastify.hasReplyDecorator("json")) fastify.decorateReply("json", formatJSON);

    fastify
        .addHook("onResponse", (req, reply, done) => {
            let latency = prettyMs(reply.getResponseTime(), { secondsDecimalDigits: 7, millisecondsDecimalDigits: 4 }).padStart(13);
            let clientIp = String(req.ip).padStart(15);
            let statusCode = coloredStatusCode(reply.statusCode);
            let method = coloredMethod(req.method);
            logger.info(`${statusCode} | ${latency} | ${clientIp} | ${method} "${req.url}"`);
            done();
        })
        .addHook("preHandler", (_, reply, done) => {
            reply.type("application/json");
            done();
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
