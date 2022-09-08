import request from "@aytea/request";
import { randomInt } from "crypto";
import { Reddit } from "../../types";

export function encodeCredentials(): string {
    return Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString("base64");
}

export async function makeGetRequest(url: string, accessToken: string): Promise<{ body: Reddit.Response | null; statusCode: number }> {
    const data = await request(url)
        .auth(accessToken, "Bearer")
        .options("throwOnError", true)
        .header("accept", "*/*")
        .header("host", "oauth.reddit.com")
        .header("user-agent", (process.env.USER_AGENT as string) ?? "MemeApi/0.0.1")
        .header("cache-control", "no-cache")
        .result()
        .then(async (data) => {
            return { body: (await data.body.json()) as Reddit.Response, statusCode: data.statusCode };
        })
        .catch((err) => {
            return { body: null, statusCode: err.statusCode };
        });

    return data;
}

export function getSubredditAPIURL(subreddit: string, limit: number): string {
    let times = ["day", "week", "month", "year", "all"];

    let url = new URL(`r/${subreddit}/top`, `https://oauth.reddit.com/`);
    url.searchParams.append("limit", `${limit}`);
    url.searchParams.append("t", times[randomInt(times.length)]);

    return url.toString();
}
