import "dotenv/config";
import fastify from "fastify";
import expressPlugin from "@fastify/express";
import fastifyRateLimit from "@fastify/rate-limit";
import { gimmeRoutes, homePage } from "#routes";
import { removeTrailingSlash, reqLogger } from "#functions";
import { config, Logger } from "#utils";
import Redis from "ioredis";

const PORT = Number(`${process.env.PORT}`) || 3000;
export const logger = new Logger({ level: Logger.Level.Debug });

(async () => {
    const server = fastify({
        ignoreTrailingSlash: true,
        trustProxy: true,
    });

    await server.register(fastifyRateLimit, { global: true, max: 45, timeWindow: "30s", redis: new Redis(config.redis.url) });
    await server.register(gimmeRoutes, { prefix: "gimme" });
    await server.register(expressPlugin);
    server
        .addHook("preHandler", removeTrailingSlash)
        .addHook("onResponse", async (_, reply) => reply.getResponseTime())
        .addHook("onResponse", reqLogger);

    server.get("/", homePage);
    server.listen({ port: PORT, host: "0.0.0.0" }, (_err, address) => {
        logger.info(`application listening at ${address}`);
    });
})();
