import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { removeNonImagePosts } from "#functions";
import { subreddits } from "#utils";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { StatusCode, Meme, NoNSFWMeme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";
import Sentry from "@sentry/node";

export async function oneRandomMeme(req: FastifyRequest, reply: FastifyReply) {
    let subreddit = subreddits[randomInt(subreddits.length)];
    let filterNSFW = (req.query as NoNSFWMeme).nonsfw === "true" ? true : false;

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
            return reply.code(StatusCode.ServiceUnavailable).json({ code: 503, message: "Error while getting Memes" });
        }

        let meme = memes[randomInt(memes.length)];
        return reply.code(StatusCode.Ok).json(meme);
    } catch (error: any) {
        Sentry.captureException(error);
        return reply.code(error.code || 503).json({ code: error.code || 503, message: error.message });
    }
}
