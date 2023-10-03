import { Reddit, StatusCode } from "#types";
import { envParseString } from "@skyra/env-utilities";
import { request } from "undici";

export async function makeRequest(url: string, token: string) {
    try {
        const res = await request(url, {
            headers: {
                authorization: `Bearer ${token}`,
                accept: "*/*",
                host: "oauth.reddit.com",
                "user-agent": envParseString("USER_AGENT") ?? "ReddViz/0.0.1",
                "cache-control": "no-cache",
            },
            throwOnError: true,
        });
        const data = (await res.body.json()) as Reddit.Response;
        return { body: data, statusCode: res.statusCode };
    } catch (error: any) {
        return { body: null, statusCode: error?.statusCode ?? StatusCode.InternalServerError };
    }
}
