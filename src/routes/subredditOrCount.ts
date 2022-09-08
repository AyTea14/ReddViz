import { Interface } from "#types";
import { FastifyReply, FastifyRequest } from "fastify";
import { nRandomMemes } from "./nRandomMemes.js";
import { onePostFromSub } from "./onePostFromSub.js";

export async function subredditOrCount(req: FastifyRequest, res: FastifyReply) {
    let route: number = Number((req.params as Interface).interface);

    return !isNaN(route) ? await nRandomMemes(req, res) : await onePostFromSub(req, res);
}
