import request from "@aytea/request";
import { AccessTokenBody } from "#types";
import { encodeCredentials } from "./utils.js";

export async function getAccessToken(): Promise<string> {
    const encodedCredentials = encodeCredentials();

    const accessToken = await request("https://www.reddit.com/api/v1/access_token")
        .body(new URLSearchParams({ grant_type: "client_credentials" }))
        .header("user-agent", process.env.USER_AGENT ?? "MemeApi/0.0.1")
        .header("content-type", "application/x-www-form-urlencoded")
        .auth(encodedCredentials, "Basic")
        .options("throwOnError", true)
        .post()
        .json<AccessTokenBody>()
        .then((data) => {
            return data.access_token;
        })
        .catch((err) => {
            console.log(`Error while trying to get access token: ` + err);
            return "";
        });

    return accessToken;
}
