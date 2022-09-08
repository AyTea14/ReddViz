import { FastifyReply, FastifyRequest } from "fastify";
import { getPostsFromCache } from "#lib/redis/redisHandler";
import { formatJSON, getNRandomMemes, removeNonImagePosts } from "#functions";
import { writePostsToCache } from "#lib/redis/redisHandler";
import { HttpStatusCode, Interface, Meme } from "#types";
import { getPosts } from "#lib/reddit/getPosts";

export async function nRandomPostsFromSub(req: FastifyRequest, reply: FastifyReply) {
    let subreddit = String((req.params as Interface).interface);
    let count = Number((req.params as Interface).count);
    if (count <= 0) return reply.status(400).send(formatJSON({ code: 400, message: "Invalid Count Value" }));
    if (count > 50) count = 50;

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

        if (memes.length < count) count = memes.length;
        memes = getNRandomMemes(memes, count);

        return reply.status(HttpStatusCode.Ok).send(formatJSON({ count: memes.length, memes }));
    } catch (error: any) {
        return reply
            .status(error.code || HttpStatusCode.ServiceUnavailable)
            .send(formatJSON({ code: error.code || HttpStatusCode.ServiceUnavailable, message: error.message }));
    }
}
