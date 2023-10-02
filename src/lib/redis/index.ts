import { envParseString } from "@skyra/env-utilities";
import Redis from "ioredis";

const redis = new Redis(envParseString("REDISCLOUD_URL"));

export { redis };
