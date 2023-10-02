import { FastifyReply, FastifyRequest } from "fastify";

export function home(_: FastifyRequest, reply: FastifyReply) {
    return reply.send(
        "Welcome to MemeAPI! For documentation and info go to https://github.com/AyTea14/MemeApiTS and if you want to use it, just add /gimme at the end of the url"
    );
}

export * from "./gimme.js";
