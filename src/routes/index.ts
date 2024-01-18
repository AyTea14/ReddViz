import { fastify } from "#root/index";
import { isNullish } from "@sapphire/utilities";
import { FastifyReply, FastifyRequest } from "fastify";

export function home(_: FastifyRequest, reply: FastifyReply) {
    return reply.send(
        "Welcome to ReddViz! For documentation and info go to https://github.com/AyTea14/ReddViz and if you want to use it, just add /gimme at the end of the url"
    );
}

export async function stats(_: FastifyRequest, reply: FastifyReply) {
    const count = await fastify.redis.get("count");
    return reply.send({
        count: isNullish(count) ? 0 : Number(count),
    });
}

export * from "./gimme.js";
