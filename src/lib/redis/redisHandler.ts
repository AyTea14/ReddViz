import redis from "./redis.js";
import { config } from "#utils";

const client = new redis(config.redis);
const PREFIX = `subreddit`;

export async function writePostsToCache(subreddit: string, memes: any) {
    let memesData = JSON.stringify(memes);

    return await client
        .set(`${PREFIX}:${subreddit}`, memesData)
        .catch((_) => ({ code: 503, message: "Error when trying to cache posts." }));
}

export async function getPostsFromCache(subreddit: string) {
    return await client
        .get(`${PREFIX}:${subreddit}`)
        .catch((_) => ({ code: 503, message: "Error when trying to get posts from cache." }));
}
