import { ACCESS_TOKEN_KEY } from "#utils/constants";
import { Nullish, isNullish, isNullishOrEmpty } from "@sapphire/utilities";
import { Post, Reddit, StatusCode } from "#types";
import { decode } from "html-entities";
import { getApiURL, getToken } from "./utils.js";
import { makeRequest } from "./request.js";
import { fastify } from "#root/index";
import { isObjectEmpty } from "#utils/functions";

export async function getPosts(subreddit: string, count: number) {
    const url = getApiURL(subreddit, count);

    let cachedToken = await fastify.redis.get(ACCESS_TOKEN_KEY);
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
            preview: {
                images: getCleanPreviewImages(post),
                gifs: getClearPreviewGifs(post),
            },
        });
    }

    return { posts, response: { code: StatusCode.Ok, message: "OK" } };
}

function getClearPreviewGifs(post: Reddit.PostDataElement) {
    let links: string[] = [];
    const preview = post.preview;

    if (isNullish(preview)) return links;
    else if (isNullishOrEmpty(preview.images)) return links;
    else if (isObjectEmpty(preview.images[0].variants)) return links;

    const gif = Reflect.get(preview.images[0].variants, "gif") as Omit<Reddit.Image, "id" | "variants"> | Nullish;

    if (isNullish(gif)) return links;

    for (let { url } of gif.resolutions) links.push(decode(url));
    links.push(decode(gif.source.url));

    return links;
}

function getCleanPreviewImages(post: Reddit.PostDataElement): string[] {
    let links: string[] = [];
    const preview = post.preview;

    if (isNullish(preview)) return links;
    else if (isNullishOrEmpty(preview.images)) return links;
    else if (isNullishOrEmpty(preview.images[0].resolutions)) return links;

    let images = preview.images[0];

    for (let image of images.resolutions) links.push(decode(image.url));
    links.push(decode(images.source.url));

    return links;
}
