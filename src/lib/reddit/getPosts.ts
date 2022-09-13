import { decode } from "html-entities";
import { HttpStatusCode, Reddit, Meme } from "#types";
import { getAccessToken } from "./oAuth.js";
import { getSubredditAPIURL, makeGetRequest } from "./utils.js";
import Sentry from "@sentry/node";

interface CustomRedditError {
    code: HttpStatusCode;
    message: string;
}

interface Posts {
    memes: Meme[] | null;
    response: CustomRedditError;
}

let accessToken: string;
(async () => {
    accessToken = await getAccessToken();
})();

export async function getPosts(subreddit: string, count: number): Promise<Posts> {
    const url = getSubredditAPIURL(subreddit, count);

    let { body, statusCode } = await makeGetRequest(url, accessToken);

    if (statusCode === HttpStatusCode.Unauthorized) {
        const req = await makeGetRequest(url, await getAccessToken());
        body = req.body;
        statusCode = req.statusCode;
    }

    if (statusCode === HttpStatusCode.InternalServerError) {
        Sentry.captureMessage("Reddit is down!");
        return {
            memes: null,
            response: {
                code: HttpStatusCode.ServiceUnavailable,
                message: "Reddit is unreachable at the moment",
            },
        };
    }

    if (statusCode === HttpStatusCode.Forbidden) {
        return {
            memes: null,
            response: {
                code: HttpStatusCode.Forbidden,
                message: "Unable to Access Subreddit. Subreddit is Locked or Private",
            },
        };
    }

    if (statusCode === HttpStatusCode.NotFound) {
        return {
            memes: null,
            response: {
                code: HttpStatusCode.NotFound,
                message: "This subreddit does not exist.",
            },
        };
    }

    if (statusCode !== HttpStatusCode.Ok) {
        Sentry.captureMessage(String(body));
        return {
            memes: null,
            response: {
                code: HttpStatusCode.InternalServerError,
                message: "Unknown error while getting posts. Please try again",
            },
        };
    }

    if (body === null) {
        return {
            memes: null,
            response: {
                code: HttpStatusCode.InternalServerError,
                message: "Error while getting memes from subreddit. Please try again",
            },
        };
    }

    if (Array.isArray(body?.data.children) && body?.data.children.length === 0) {
        return {
            memes: null,
            response: {
                code: HttpStatusCode.NotFound,
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

    return { memes, response: { code: HttpStatusCode.Ok, message: "OK" } };
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
