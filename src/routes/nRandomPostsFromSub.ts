import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { getNRandomMemes, removeNonImagePosts } from "#functions";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { HttpStatusCode, InterfaceParams, Meme, NoNSFWMeme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";
import Sentry from "@sentry/node";

export async function nRandomPostsFromSub(req: FastifyRequest, reply: FastifyReply) {
    let subreddit = String((req.params as InterfaceParams).interface);
    let count = Number((req.params as InterfaceParams).count);
    let filterNSFW = (req.query as NoNSFWMeme).nonsfw === "true" ? true : false;
    if (count <= 0) return reply.code(400).json({ code: 400, message: "Invalid Count Value" });
    if (count > 50) count = 50;

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
                .code(HttpStatusCode.BadRequest)
                .json({ code: HttpStatusCode.BadRequest, message: `r/${subreddit} only has NSFW Posts or has no Posts with Images` });
        }
        if (Array.isArray(memes) && memes.length === 0) {
            return reply
                .code(HttpStatusCode.BadRequest)
                .json({ code: HttpStatusCode.BadRequest, message: `r/${subreddit} has no Posts with Images` });
        }

        if (memes.length < count) count = memes.length;
        memes = getNRandomMemes(memes, count);

        return reply.code(HttpStatusCode.Ok).json({ count: memes.length, memes });
    } catch (error: any) {
        Sentry.captureException(error);
        return reply
            .code(error.code || HttpStatusCode.ServiceUnavailable)
            .json({ code: error.code || HttpStatusCode.ServiceUnavailable, message: error.message });
    }
}
