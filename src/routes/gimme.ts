import { getPosts } from "#lib/reddit";
import { redis } from "#lib/redis";
import { Post, StatusCode } from "#types";
import { SUBREDDITS, SUB_EXPIRE, SUB_PREFIX } from "#utils/constants";
import { getNGimme, onlyImagePosts } from "#utils/functions";
import { isNullish, isNullishOrEmpty } from "@sapphire/utilities";
import { randomInt } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";

export async function gimme(req: FastifyRequest, reply: FastifyReply) {
    let query = req.query as { count: string; nonsfw: string };
    let params = req.params as { subreddit: string };

    let subreddit = isNullish(params.subreddit) ? SUBREDDITS[randomInt(SUBREDDITS.length)] : params.subreddit;
    let count = Number(query.count);
    let nonsfw = query.nonsfw === "true" ? true : false;

    if (!isNullish(query.count)) {
        if (isNaN(count) || count <= 0)
            return reply.code(StatusCode.BadRequest).send({ code: StatusCode.BadRequest, message: "Invalid Count Value" });
        if (count > 50) count = 50;
    }

    try {
        let posts = JSON.parse(`${await redis.getBuffer(`${SUB_PREFIX}:${subreddit}`)}`) as Post[];

        if (isNullishOrEmpty(posts)) {
            let { posts: freshPosts, response } = await getPosts(subreddit, 100);

            if (isNullishOrEmpty(freshPosts)) {
                return reply.code(response.code).send(response);
            }

            freshPosts = onlyImagePosts(freshPosts);
            await redis.setex(`${SUB_PREFIX}:${subreddit}`, SUB_EXPIRE, JSON.stringify(freshPosts));
            posts = freshPosts;
        }
        posts = nonsfw ? Array.from(posts).filter((x) => !x.nsfw) : posts;

        if (nonsfw && isNullishOrEmpty(posts) && posts.every((x) => x.nsfw))
            return reply.code(StatusCode.ServiceUnavailable).send({
                code: StatusCode.ServiceUnavailable,
                message: `r/${subreddit} only has NSFW Posts or has no Posts with Images`,
            });
        if (isNullishOrEmpty(posts))
            return reply
                .code(StatusCode.InternalServerError)
                .send({ code: StatusCode.InternalServerError, message: "Error while getting posts" });

        if (!isNaN(count)) {
            if (posts.length < count) count = posts.length;
            posts = getNGimme(posts, count);
            return reply.code(StatusCode.Ok).send({ count, posts });
        }

        let post = posts[randomInt(posts.length)];
        return reply.code(StatusCode.Ok).send(post);
    } catch (error: any) {
        return reply
            .code(error.code ?? StatusCode.ServiceUnavailable)
            .send({ code: error.code ?? StatusCode.ServiceUnavailable, message: error.message });
    }
}
