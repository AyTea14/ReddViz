import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { removeNonImagePosts } from "#functions";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { StatusCode, InterfaceParams, Meme, NoNSFWMeme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";
import Sentry from "@sentry/node";

export async function onePostFromSub(req: FastifyRequest, reply: FastifyReply) {
    let subreddit = String((req.params as InterfaceParams).interface);
    let filterNSFW = (req.query as NoNSFWMeme).nonsfw === "true" ? true : false;

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
        memes = Array.from(memes).filter((x) => (filterNSFW ? x.nsfw === false : x.nsfw === true || x.nsfw === false));

        if (Array.isArray(memes) && memes.length === 0 && filterNSFW) {
            return reply
                .code(StatusCode.BadRequest)
                .json({ code: StatusCode.BadRequest, message: `r/${subreddit} only has NSFW Posts or has no Posts with Images` });
        }
        if (Array.isArray(memes) && memes.length === 0) {
            return reply
                .code(StatusCode.BadRequest)
                .json({ code: StatusCode.BadRequest, message: `r/${subreddit} has no Posts with Images` });
        }

        let meme = memes[randomInt(memes.length)];
        return reply.code(StatusCode.Ok).json(meme);
    } catch (error: any) {
        Sentry.captureException(error);
        return reply
            .code(error.code || StatusCode.ServiceUnavailable)
            .json({ code: error.code || StatusCode.ServiceUnavailable, message: error.message });
    }
}
