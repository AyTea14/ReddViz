import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { formatJSON, removeNonImagePosts } from "#functions";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { HttpStatusCode, InterfaceParams, Meme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";

export async function onePostFromSub(req: FastifyRequest, reply: FastifyReply) {
    let subreddit = String((req.params as InterfaceParams).interface);

    try {
        let memes: Meme[] = JSON.parse((await getPostsFromCache(subreddit)) as any);

        if (!memes || memes.length === 0) {
            let { memes: freshMemes, response } = await getPosts(subreddit, 100);

            if (freshMemes === null) {
                return reply.status(response.code).send(formatJSON(response));
            }

            freshMemes = removeNonImagePosts(freshMemes);
            await writePostsToCache(subreddit, freshMemes);
            memes = freshMemes;
        }

        if (Array.isArray(memes) && memes.length === 0) {
            return reply
                .status(HttpStatusCode.BadRequest)
                .send(formatJSON({ code: HttpStatusCode.BadRequest, message: `r/${subreddit} has no Posts with Images` }));
        }

        let meme = memes[randomInt(memes.length)];
        return reply.status(HttpStatusCode.Ok).send(formatJSON(meme));
    } catch (error: any) {
        return reply
            .status(error.code || HttpStatusCode.ServiceUnavailable)
            .send(formatJSON({ code: error.code || HttpStatusCode.ServiceUnavailable, message: error.message }));
    }
}
