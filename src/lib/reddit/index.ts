import { ACCESS_TOKEN } from "#utils/constants";
import { isNullish } from "@sapphire/utilities";
import { Post, Reddit, StatusCode } from "#types";
import { decode } from "html-entities";
import { getApiURL, getToken } from "./utils.js";
import { makeRequest } from "./request.js";
import { fastify } from "#root/index";

export async function getPosts(subreddit: string, count: number) {
    const url = getApiURL(subreddit, count);

    let cachedToken = await fastify.redis.get(ACCESS_TOKEN);
    let token = isNullish(cachedToken) ? await getToken() : cachedToken;

    let { body, statusCode } = await makeRequest(url, token);

    if (statusCode === StatusCode.Unauthorized) {
        token = await getToken();
        const req = await makeRequest(url, token);
        body = req.body;
        statusCode = req.statusCode;
    }

    if (statusCode === StatusCode.InternalServerError) {
        return {
            posts: null,
            response: {
                code: StatusCode.ServiceUnavailable,
                message: "Reddit is unreachable at the moment",
            },
        };
    }

    if (statusCode === StatusCode.Forbidden) {
        return {
            posts: null,
            response: {
                code: StatusCode.Forbidden,
                message: "Unable to Access Subreddit. Subreddit is Locked or Private",
            },
        };
    }

    if (statusCode === StatusCode.NotFound) {
        return {
            posts: null,
            response: {
                code: StatusCode.NotFound,
                message: "This subreddit does not exist.",
            },
        };
    }

    if (statusCode !== StatusCode.Ok) {
        return {
            posts: null,
            response: {
                code: StatusCode.InternalServerError,
                message: "Unknown error while getting posts. Please try again",
            },
        };
    }

    if (body === null) {
        return {
            posts: null,
            response: {
                code: StatusCode.InternalServerError,
                message: "Error while getting posts from subreddit. Please try again",
            },
        };
    }

    if (Array.isArray(body?.data.children) && body?.data.children.length === 0) {
        return {
            posts: null,
            response: {
                code: StatusCode.NotFound,
                message: "This subreddit has no posts or doesn't exist.",
            },
        };
    }

    let posts: Post[] = [];
    for (let { data: post } of body.data.children) {
        posts.push({
            id: decode(post.id),
            title: decode(post.title),
            subreddit: decode(post.subreddit),
            author: decode(post.author),
            postLink: decode(new URL(`${post.permalink}`, "https://www.reddit.com").toString()),
            thumbnail: decode(post.thumbnail),
            image: decode(post.url),
            nsfw: post.over_18,
            spoiler: post.spoiler,
            upvotes: post.ups,
            comments: post.num_comments,
            createdUtc: post.created_utc,
            upvoteRatio: post.upvote_ratio,
            preview: getCleanPreviewImage(post),
        });
    }

    return { posts, response: { code: StatusCode.Ok, message: "OK" } };
}

function getCleanPreviewImage(post: Reddit.PostDataElement): string[] {
    let links: string[] = [];
    const preview = post.preview;

    if (post && preview) {
        if (preview && preview.images.length) {
            let images = preview.images;
            if (images.length !== 0 && images[0].resolutions.length !== 0) {
                for (let image of images[0].resolutions) links.push(decode(image.url));
                links.push(decode(images[0].source.url));
            } else if (images.length !== 0 && images[0].resolutions.length === 0 && images[0].source)
                links.push(decode(images[0].source.url));
            else links.push(decode(post.url));
        }
    } else links.push(post.url);

    return links;
}
