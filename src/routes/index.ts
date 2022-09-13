// import { NextFunction, Request, Response } from "express";
import { FastifyInstance, RegisterOptions, FastifyReply, FastifyRequest } from "fastify";
import { nRandomPostsFromSub } from "./nRandomPostsFromSub.js";
import { oneRandomMeme } from "./oneRandomMeme.js";
import { subredditOrCount } from "./subredditOrCount.js";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [new RewriteFrames({ root: global.__dirname })],
});

export async function gimmeRoutes(fastify: FastifyInstance, _: RegisterOptions): Promise<void> {
    fastify
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
