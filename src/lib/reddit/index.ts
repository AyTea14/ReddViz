import { redis } from "#lib/redis";
import { ACCESS_TOKEN } from "#utils/constants";
import { isNullish } from "@sapphire/utilities";
import { Meme, Reddit, StatusCode } from "#types";
import { decode } from "html-entities";
import { getApiURL, getToken } from "./utils.js";
import { makeRequest } from "./request.js";

export async function getPosts(subreddit: string, count: number) {
    const url = getApiURL(subreddit, count);

    let cachedToken = await redis.get(ACCESS_TOKEN);
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
            memes: null,
            response: {
                code: StatusCode.ServiceUnavailable,
                message: "Reddit is unreachable at the moment",
            },
        };
    }

    if (statusCode === StatusCode.Forbidden) {
        return {
            memes: null,
            response: {
                code: StatusCode.Forbidden,
                message: "Unable to Access Subreddit. Subreddit is Locked or Private",
            },
        };
    }

    if (statusCode === StatusCode.NotFound) {
        return {
            memes: null,
            response: {
                code: StatusCode.NotFound,
                message: "This subreddit does not exist.",
            },
        };
    }

    if (statusCode !== StatusCode.Ok) {
        return {
            memes: null,
            response: {
                code: StatusCode.InternalServerError,
                message: "Unknown error while getting posts. Please try again",
            },
        };
    }

    if (body === null) {
        return {
            memes: null,
            response: {
                code: StatusCode.InternalServerError,
                message: "Error while getting memes from subreddit. Please try again",
            },
        };
    }

    if (Array.isArray(body?.data.children) && body?.data.children.length === 0) {
        return {
            memes: null,
            response: {
                code: StatusCode.NotFound,
                message: "This subreddit has no posts or doesn't exist.",
            },
        };
    }

    let memes: Meme[] = [];
    for (let { data: post } of body.data.children) {
        memes.push({
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

    return { memes, response: { code: StatusCode.Ok, message: "OK" } };
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
