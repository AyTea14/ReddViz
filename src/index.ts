import "dotenv/config";
import fastify from "fastify";
import expressPlugin from "@fastify/express";
import { routes } from "./routes/index.js";
import { removeTrailingSlash } from "#functions";
import { morganMiddleware } from "#utils";

async function build() {
    const server = fastify({
        ignoreTrailingSlash: true,
        trustProxy: true,
    });

    await server.register(expressPlugin);
    server.addHook("preHandler", removeTrailingSlash);

    server.use(morganMiddleware);
    return server;
}

const PORT = parseInt(process.env.PORT as string) || 3000;
build()
    .then((server) => {
        routes(server);
        server.listen({ port: PORT, host: "0.0.0.0" }, (_err, address) => {
            console.log(`application listening at ${address}`);
        });
    })
    .catch(console.log);
