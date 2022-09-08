import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { getNRandomMemes, removeNonImagePosts } from "#functions";
import { subreddits } from "#utils";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { HttpStatusCode, Interface, Meme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";

export async function nRandomMemes(req: FastifyRequest, reply: FastifyReply) {
    let subreddit = subreddits[randomInt(subreddits.length)];
    let count = Number((req.params as Interface).interface);
    if (count <= 0) return reply.status(400).send(JSON.stringify({ code: 400, message: "Invalid Count Value" }, undefined, 3));
    if (count > 50) count = 50;

    try {
        let memes: Meme[] = JSON.parse((await getPostsFromCache(subreddit)) as any);

        if (!memes || memes.length === 0) {
            let { memes: freshMemes, response } = await getPosts(subreddit, 100);

            if (freshMemes === null) {
                return reply.status(response.code).send(JSON.stringify(response, undefined, 3));
            }

            freshMemes = removeNonImagePosts(freshMemes);
            await writePostsToCache(subreddit, freshMemes);
            memes = freshMemes;
        }

        if (Array.isArray(memes) && memes.length === 0) {
            return reply
                .status(HttpStatusCode.ServiceUnavailable)
                .send(JSON.stringify({ code: 503, message: "Error while getting Memes" }, undefined, 3));
        }
        if (memes.length === 0) {
            return reply.status(503).send(JSON.stringify({ code: 503, message: "Error while getting Memes" }, undefined, 3));
        }

        if (memes.length < count) count = memes.length;
        memes = getNRandomMemes(memes, count);

        return reply.status(HttpStatusCode.Ok).send(JSON.stringify({ count: memes.length, memes }, undefined, 3));
    } catch (error: any) {
        return reply.status(error.code || 503).send(JSON.stringify({ code: error.code || 503, message: error.message }, undefined, 3));
    }
}
