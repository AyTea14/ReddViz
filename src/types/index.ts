export * from "./HttpStatusCodes.js";
export * from "./gimme/index.js";
export * from "./reddit/index.js";
export * from "./config.js";

declare module "fastify" {
    interface FastifyReply {
        json(payload: unknown, indent?: number): FastifyReply;
    }
}
