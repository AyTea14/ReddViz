import { fastify } from "#root/index";
import { TOTAL_REQUEST_KEY } from "#utils/constants";

export async function updateStats() {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format
    const thisMonth = today.split("-").slice(0, 2).join("-"); // Get this month in "YYYY-MM" format

    await fastify.redis.incr(`${TOTAL_REQUEST_KEY}total`);
    await fastify.redis.incr(`${TOTAL_REQUEST_KEY}daily;${today}`);
    await fastify.redis.incr(`${TOTAL_REQUEST_KEY}monthly;${thisMonth}`);
}

export async function getStatsWithPrefix(prefix: string) {
    const keys = await fastify.redis.keys(`${prefix}*`);
    const stats: Record<string, any> = {};

    for (const key of keys.sort().reverse()) {
        const value = await fastify.redis.get(key);
        const date = key.substring(prefix.length);

        stats[date] = parseInt(value ?? "0", 10);
    }

    return stats;
}
