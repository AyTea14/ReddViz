import { decode } from "html-entities";
import { HttpStatusCode, Reddit, Meme } from "#types";
import { getAccessToken } from "./oAuth.js";
import { getSubredditAPIURL, makeGetRequest } from "./utils.js";

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
        accessToken = await getAccessToken();

        const req = await makeGetRequest(url, accessToken);
        body = req.body;
        statusCode = req.statusCode;
    }

    if (statusCode === HttpStatusCode.InternalServerError) {
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
    for (let post of body.data.children) {
        memes.push({
            id: decode(post.data.id),
            title: decode(post.data.title),
            subreddit: decode(post.data.subreddit),
            author: decode(post.data.author),
            postLink: decode(new URL(`${post.data.permalink}`, "https://www.reddit.com").toString()),
            thumbnail: decode(post.data.thumbnail),
            image: decode(post.data.url),
            nsfw: post.data.over_18,
            spoiler: post.data.spoiler,
            upvotes: post.data.ups,
            comments: post.data.num_comments,
            createdUtc: post.data.created_utc,
            upvoteRatio: post.data.upvote_ratio,
            preview: getCleanPreviewImage(post),
        });
    }

    return { memes, response: { code: HttpStatusCode.Ok, message: "OK" } };
}

function getCleanPreviewImage(post: Reddit.Child): string[] {
    let links: string[] = [];
    const preview = post.data.preview;

    if (post && preview) {
        if (preview && preview.images.length) {
            let images = preview.images;
            if (images.length !== 0 && images[0].resolutions.length !== 0) {
                for (let image of images[0].resolutions) {
                    links.push(decode(image.url));
                }
                links.push(decode(images[0].source.url));
            } else if (images.length !== 0 && images[0].resolutions.length === 0 && images[0].source) {
                links.push(decode(images[0].source.url));
            } else links.push(decode(post.data.url));
        }
    } else links.push(post.data.url);

    return links;
}
