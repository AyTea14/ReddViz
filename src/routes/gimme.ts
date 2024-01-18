import { getPosts } from "#lib/reddit";
import { Post, StatusCode } from "#types";
import { SUBREDDITS, SUB_EXPIRE, SUB_PREFIX } from "#utils/constants";
import { getNGimme, onlyImagePosts } from "#utils/functions";
import { isNullish, isNullishOrEmpty } from "@sapphire/utilities";
import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "#root/index";
import { destr } from "destr";

export async function gimme(
    req: FastifyRequest<{
        Querystring: { c: string; nonsfw: string };
        Params: { subreddit: string };
    }>,
    reply: FastifyReply
) {
    let { query, params } = req;

    let subreddit = isNullish(params.subreddit) ? SUBREDDITS[randomInt(SUBREDDITS.length)] : params.subreddit.toLowerCase();
    let count = Number(query.c);
    let nonsfw = Reflect.has(query, "nonsfw");

    if (!isNullish(query.c)) {
        if (isNaN(count) || count <= 0)
            return reply.code(StatusCode.BadRequest).send({ code: StatusCode.BadRequest, message: "Invalid Count Value" });
        if (count > 50) count = 50;
    }

    try {
        let buffer = await fastify.redis.getBuffer(`${SUB_PREFIX}${subreddit}`);
        let posts = isNullish(buffer) ? null : destr<Post[]>(buffer.toString());

        if (isNullishOrEmpty(posts)) {
            let { posts: freshPosts, response } = await getPosts(subreddit, 100);

            if (isNullishOrEmpty(freshPosts)) {
                return reply.code(response.code).send(response);
            }

            freshPosts = onlyImagePosts(freshPosts);
            await fastify.redis.setex(`${SUB_PREFIX}${subreddit}`, SUB_EXPIRE, JSON.stringify(freshPosts));
            posts = freshPosts;
        }
        posts = nonsfw ? posts.filter((x) => !x.nsfw) : posts;

        if (nonsfw && isNullishOrEmpty(posts) && posts.every((x) => x.nsfw))
            return reply.code(StatusCode.Forbidden).send({
                code: StatusCode.Forbidden,
                message: `r/${subreddit} only has NSFW Posts`,
            });
        if (isNullishOrEmpty(posts))
            return reply.code(StatusCode.NotFound).send({
                code: StatusCode.NotFound,
                message: isNullish(params.subreddit) ? "Error while getting posts" : `r/${subreddit} has no Posts with Images`,
            });

        if (!isNaN(count)) {
            if (posts.length < count) count = posts.length;
            posts = getNGimme(posts, count);
            return reply.code(StatusCode.Ok).send({ count, posts });
        }

        let post = posts[randomInt(posts.length)];
        await fastify.redis.incr("count");
        return reply.code(StatusCode.Ok).send(post);
    } catch (error: any) {
        return reply
            .code(error.code ?? StatusCode.ServiceUnavailable)
            .send({ code: error.code ?? StatusCode.ServiceUnavailable, message: error.message });
    }
}
