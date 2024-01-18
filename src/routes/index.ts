import { fastify } from "#root/index";
import { TOTAL_REQUEST_KEY } from "#utils/constants";
import { getStatsWithPrefix } from "#utils/stats";
import { isNullish } from "@sapphire/utilities";
import { FastifyReply, FastifyRequest } from "fastify";

export function home(_: FastifyRequest, reply: FastifyReply) {
    return reply.send(
        "Welcome to ReddViz! For documentation and info go to https://github.com/AyTea14/ReddViz and if you want to use it, just add /gimme at the end of the url"
    );
}

export async function stats(_: FastifyRequest, reply: FastifyReply) {
    const total = await fastify.redis.get(`${TOTAL_REQUEST_KEY}total`);

    const daily = await getStatsWithPrefix(`${TOTAL_REQUEST_KEY}daily;`);
    const monthly = await getStatsWithPrefix(`${TOTAL_REQUEST_KEY}monthly;`);

    return reply.send({
        total: isNullish(total) ? 0 : Number(total),
        daily,
        monthly,
    });
}

export * from "./gimme.js";
