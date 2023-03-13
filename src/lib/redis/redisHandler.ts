import redis from "./redis.js";
import { config } from "#utils";

const client = new redis(config.redis);
const PREFIX = `subreddit`;

export const writePostsToCache = (subreddit: string, memes: any) => {
    let memesData = JSON.stringify(memes);

    return client.set(`${PREFIX}:${subreddit}`, memesData).catch((_) => ({ code: 503, message: "Error when trying to cache posts." }));
};

export const getPostsFromCache = (subreddit: string) => {
    return client.get(`${PREFIX}:${subreddit}`).catch((_) => ({ code: 503, message: "Error when trying to get posts from cache." }));
};
