import redis from "./redis.js";
import { config } from "#utils";

const client = new redis(config.redis);

export const writePostsToCache = (subreddit: string, memes: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        let memesData = JSON.stringify(memes);

        return client.set(subreddit, memesData, (result: boolean) => {
            if (!result) reject({ code: 503, message: "Error when trying to cache posts." });
            else resolve();
        });
    });
};

export const getPostsFromCache = (subreddit: string): Promise<Buffer | boolean> => {
    return new Promise((resolve, reject) => {
        client
            .get(subreddit, (result: boolean | Buffer) => resolve(result))
            .catch((_error: any) => reject({ code: 503, message: "Error when trying to get posts from cache." }));
    });
};
