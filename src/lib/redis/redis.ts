import redis, { type Redis } from "ioredis";
import { Config } from "../../types";

export default class {
    private config: {} = {};
    private expire: number;
    private url: string;
    public client: Redis;

    constructor(config: Config) {
        config.host ??= "127.0.0.1";
        config.port ??= 6379;

        this.expire = config.expire!;
        this.config = config;
        this.url = config.url || "";
        this.client = new redis(this.url || this.config);
        this.client.connect(() => console.log("connected to redis database"));
    }

    async set(key: string, data: any, callback: (setSuccessful: boolean) => void) {
        if (!this.client) {
            throw new Error("No redis client");
        }

        try {
            await this.client.setex(key, this.expire, Buffer.from(data));

            if (callback) callback(true);
        } catch (e) {
            if (callback) callback(false);
        }
    }

    async get(key: string, callback: (result: boolean | Buffer) => void) {
        if (!this.client) {
            throw new Error("No redis client");
        }

        try {
            const data = await this.client.getBuffer(key);

            if (callback) callback(data);
        } catch (e) {
            if (callback) callback(false);
        }
    }
}
