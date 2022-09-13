import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { removeNonImagePosts } from "#functions";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { HttpStatusCode, InterfaceParams, Meme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";
import Sentry from "@sentry/node";

export async function onePostFromSub(req: FastifyRequest, reply: FastifyReply) {
    let subreddit = String((req.params as InterfaceParams).interface);

    try {
        let memes: Meme[] = JSON.parse((await getPostsFromCache(subreddit)) as any);

        if (!memes || memes.length === 0) {
            let { memes: freshMemes, response } = await getPosts(subreddit, 100);

            if (freshMemes === null) {
                return reply.code(response.code).json(response);
            }

            freshMemes = removeNonImagePosts(freshMemes);
            await writePostsToCache(subreddit, freshMemes).catch(Sentry.captureException);
            memes = freshMemes;
        }

        if (Array.isArray(memes) && memes.length === 0) {
            return reply
                .code(HttpStatusCode.BadRequest)
                .json({ code: HttpStatusCode.BadRequest, message: `r/${subreddit} has no Posts with Images` });
        }

        let meme = memes[randomInt(memes.length)];
        return reply.code(HttpStatusCode.Ok).json(meme);
    } catch (error: any) {
        Sentry.captureException(error);
        return reply
            .code(error.code || HttpStatusCode.ServiceUnavailable)
            .json({ code: error.code || HttpStatusCode.ServiceUnavailable, message: error.message });
    }
}
