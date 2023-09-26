import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { getNRandomMemes, removeNonImagePosts } from "#functions";
import { subreddits } from "#utils";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { StatusCode, InterfaceParams, Meme, NoNSFWMeme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";
import Sentry from "@sentry/node";

export async function nRandomMemes(req: FastifyRequest, reply: FastifyReply) {
    let subreddit = subreddits[randomInt(subreddits.length)];
    let count = Number((req.params as InterfaceParams).interface);
    let filterNSFW = (req.query as NoNSFWMeme).nonsfw === "true" ? true : false;
    if (count <= 0) return reply.code(400).json({ code: 400, message: "Invalid Count Value" });
    if (count > 50) count = 50;

    try {
        let memes: Meme[] = JSON.parse(`${await getPostsFromCache(subreddit)}`);

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

        if (Array.isArray(memes) && memes.length === 0) {
            return reply
                .code(StatusCode.InternalServerError)
                .json({ code: StatusCode.InternalServerError, message: "Error while getting Memes" });
        }

        if (memes.length < count) count = memes.length;
        memes = getNRandomMemes(memes, count);

        return reply.code(StatusCode.Ok).json({ count: memes.length, memes });
    } catch (error: any) {
        Sentry.captureException(error);
        return reply
            .code(error.code || StatusCode.ServiceUnavailable)
            .json({ code: error.code || StatusCode.ServiceUnavailable, message: error.message });
    }
}
