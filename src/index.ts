import "#lib/env";
import { gimme, home, stats } from "#routes";
import { removeTrailingSlash, reqLogger } from "#utils/functions";
import { envParseInteger, envParseString } from "@skyra/env-utilities";
import { Logger } from "@skyra/logger";
import { Redis } from "ioredis";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyRedis from "@fastify/redis";
import fastify from "fastify";

const PORT = envParseInteger("PORT", 8787);
const redis = new Redis(envParseString("REDISCLOUD_URL"));
export const logger = new Logger();

const server = fastify({
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
    trustProxy: true,
});

await server.register(fastifyRedis, {
    client: redis,
});
await server.register(fastifyRateLimit, {
    global: true,
    max: 45,
    timeWindow: "30s",
    nameSpace: "rateLimit;",
    redis,
});

server
    .get("/", home) //
    .get("/stats", stats)
    .get("/gimme/:subreddit?", gimme);

server
    .addHook("preHandler", removeTrailingSlash)
    .addHook("onResponse", async (_, reply) => reply.getResponseTime())
    .addHook("onResponse", reqLogger);

export { server as fastify };

server.listen({ port: PORT, host: "0.0.0.0" }, (_err, address) => {
    logger.info(`application listening at ${address}`);
});
