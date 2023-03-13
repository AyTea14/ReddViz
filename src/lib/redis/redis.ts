import { logger } from "#root/index";
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
        this.client.connect(() => logger.info("connected to redis database"));
    }

    set<T>(key: string, data: T): Promise<boolean>;
    set<T>(key: string, data: T, callback: (setSuccessful: boolean) => void): Promise<boolean>;
    async set<T>(key: string, data: T, callback?: (setSuccessful: boolean) => void) {
        if (!this.client) {
            throw new Error("No redis client");
        }

        try {
            await this.client.setex(key, this.expire, Buffer.from(`${data}`));

            if (callback) callback(true);
            return true;
        } catch (e) {
            if (callback) callback(false);
            throw e;
        }
    }

    get(key: string): Promise<Buffer>;
    get(key: string, callback: (result: boolean | Buffer) => void): Promise<Buffer>;
    async get(key: string, callback?: (result: boolean | Buffer) => void) {
        if (!this.client) {
            throw new Error("No redis client");
        }

        try {
            const data = await this.client.getBuffer(key);

            if (callback) callback(data);
            return data;
        } catch (e) {
            if (callback) callback(false);
            throw e;
        }
    }
}
