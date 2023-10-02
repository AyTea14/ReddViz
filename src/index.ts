import "#lib/env";
import rateLimit from "@fastify/rate-limit";
import fastify from "fastify";
import { envParseInteger, envParseString } from "@skyra/env-utilities";
import { Redis } from "ioredis";
import { redis } from "#lib/redis";
import { gimme, home } from "#routes";
import { removeTrailingSlash, reqLogger } from "#utils/functions";
import { Logger } from "@skyra/logger";

const PORT = envParseInteger("PORT", 8787);
export const logger = new Logger();

const server = fastify({
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
    trustProxy: true,
});

redis.connect(() => logger.info(`connected to redis database`));
await server.register(rateLimit, {
    global: true,
    max: 45,
    timeWindow: "30s",
    redis: new Redis(envParseString("REDISCLOUD_URL")),
    nameSpace: "rateLimit:",
});

server
    .get("/", home) //
    .get("/gimme/:subreddit?", gimme);

server
    .addHook("preHandler", removeTrailingSlash)
    .addHook("onResponse", async (_, reply) => reply.getResponseTime())
    .addHook("onResponse", reqLogger);

server.listen({ port: PORT, host: "0.0.0.0" }, (_err, address) => {
    logger.info(`application listening at ${address}`);
});
