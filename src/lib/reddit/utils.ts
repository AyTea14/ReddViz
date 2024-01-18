import { fastify } from "#root/index";
import { AccessTokenBody } from "#types";
import { ACCESS_TOKEN_KEY, TIMES } from "#utils/constants";
import { envParseString } from "@skyra/env-utilities";
import { randomInt } from "crypto";
import { request } from "undici";

function encodeCredentials(): string {
    return btoa(`${envParseString("REDDIT_CLIENT_ID")}:${envParseString("REDDIT_CLIENT_SECRET")}`);
}

export function getApiURL(subreddit: string, limit: number): string {
    let url = new URL(`r/${subreddit}/top`, `https://oauth.reddit.com/`);
    url.search = new URLSearchParams({ limit: `${limit}`, t: TIMES[randomInt(TIMES.length)] }).toString();

    return url.toString();
}

export async function getToken() {
    const encodedCredentials = encodeCredentials();

    try {
        const res = await request("https://www.reddit.com/api/v1/access_token", {
            method: "POST",
            body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
            headers: {
                "user-agent": envParseString("USER_AGENT") ?? "ReddViz/0.0.1",
                "content-type": "application/x-www-form-urlencoded",
                authorization: `Basic ${encodedCredentials}`,
            },
            throwOnError: true,
        });
        const data = (await res.body.json()) as AccessTokenBody;

        fastify.redis.setex(ACCESS_TOKEN_KEY, data.expires_in, data.access_token);

        return data.access_token;
    } catch (error) {
        return "";
    }
}
