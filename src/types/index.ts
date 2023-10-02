import type { IntegerString } from "@skyra/env-utilities";

declare module "@skyra/env-utilities" {
    interface Env {
        PORT: IntegerString;

        REDDIT_CLIENT_ID: string;
        REDDIT_CLIENT_SECRET: string;

        USER_AGENT: string;
        SENTRY_DSN: string;
        REDISCLOUD_URL: string;
    }
}

export * from "./reddit.js";
export * from "./status-code.js";
export * from "./gimme.js";
