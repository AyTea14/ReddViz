export const config = {
    redis: {
        host: process.env.STORAGE_HOST || undefined,
        port: parseInt(process.env.STORAGE_PORT!) || 6273,
        password: process.env.STORAGE_PASSWORD || undefined,
        url: process.env.REDISCLOUD_URL,
        expire: Number(process.env.STORAGE_EXPIRE) || 7200,
    },
};
