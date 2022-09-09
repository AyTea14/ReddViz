import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { formatJSON, removeNonImagePosts } from "#functions";
import { subreddits } from "#utils";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { HttpStatusCode, Meme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";

export async function oneRandomMeme(_req: FastifyRequest, reply: FastifyReply) {
    let subreddit = subreddits[randomInt(subreddits.length)];

    try {
        let memes: Meme[] = JSON.parse((await getPostsFromCache(subreddit)) as any);

        if (!memes || memes.length === 0) {
            let { memes: freshMemes, response } = await getPosts(subreddit, 100);

            if (freshMemes === null) {
                return reply.status(response.code).type("application/json").send(formatJSON(response));
            }

            freshMemes = removeNonImagePosts(freshMemes);
            await writePostsToCache(subreddit, freshMemes);
            memes = freshMemes;
        }

        if (Array.isArray(memes) && memes.length === 0) {
            return reply
                .status(HttpStatusCode.ServiceUnavailable)
                .type("application/json")
                .send(formatJSON({ code: 503, message: "Error while getting Memes" }));
        }

        let meme = memes[randomInt(memes.length)];
        return reply.status(HttpStatusCode.Ok).type("application/json").send(formatJSON(meme));
    } catch (error: any) {
        return reply
            .status(error.code || 503)
            .type("application/json")
            .send(formatJSON({ code: error.code || 503, message: error.message }));
    }
}
