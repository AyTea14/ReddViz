import "dotenv/config";
import fastify from "fastify";
import expressPlugin from "@fastify/express";
import { gimmeRoutes, homePage } from "./routes/index.js";
import { removeTrailingSlash } from "#functions";
import { Logger } from "#utils";

const PORT = parseInt(process.env.PORT as string) || 3000;
export const logger = new Logger({ level: Logger.Level.Debug });

(async () => {
    const server = fastify({
        ignoreTrailingSlash: true,
        trustProxy: true,
    });

    await server.register(gimmeRoutes, { prefix: "gimme" });
    await server.register(expressPlugin);
    server.addHook("preHandler", removeTrailingSlash);
    server.addHook("onResponse", (_, reply) => reply.getResponseTime());

    server.get("/", homePage);
    server.listen({ port: PORT, host: "0.0.0.0" }, (_err, address) => {
        logger.info(`application listening at ${address}`);
    });
})();
