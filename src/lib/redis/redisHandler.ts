import redis from "./redis.js";
import { config } from "#utils";
import { getAccessToken } from "#lib/reddit/oAuth";

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

export async function accessToken(regenerate = false) {
    let cached = JSON.parse(`${await client.get("accessToken")}`) as { token: string; expiresIn: number };
    if (!cached) {
        cached = await getAccessToken();
        let expiresIn = cached.expiresIn < 1 ? 0 : cached.expiresIn - 60;
        await client.setex("accessToken", JSON.stringify(cached), expiresIn);
    } else if (regenerate || Date.now() + cached.expiresIn * 1000 < Date.now() - 60000) {
        cached = await getAccessToken();
        let expiresIn = cached.expiresIn < 1 ? 0 : cached.expiresIn - 60;
        await client.setex("accessToken", JSON.stringify(cached), expiresIn);
    }

    return cached;
}
