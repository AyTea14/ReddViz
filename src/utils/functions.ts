import { Post } from "#types";
import { bgBlue, bgCyan, bgGreen, bgMagenta, bgRed, bgWhite, bgYellow, black, whiteBright } from "colorette";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { extname } from "path";
import { logger } from "#root/index";
import prettyMs from "pretty-ms";

export function onlyImagePosts(posts: Post[] | null) {
    let imagePosts: Post[] = [];
    if (Array.isArray(posts)) {
        for (let post of posts) {
            let url = post.image;
            try {
                let ext = extname(new URL(url).pathname);
                if (
                    ![".gifv"].includes(ext) &&
                    [".jpg", ".png", ".gif", ".jpeg"].includes(ext) //
                )
                    imagePosts.push(post);
            } catch (error) {}
        }
    }
    return imagePosts;
}

export function getNGimme<T>(arr: Array<T>, picks: number): Array<T> {
    if (!Array.isArray(arr)) throw new Error("getNGimme() expect an array as parameter.");

    let rng = Math.random;
    if (typeof picks === "number" && picks > 1) {
        let len: number = arr.length,
            collection = arr.slice(),
            random: Array<T> = [],
            index = 0;

        while (picks && len) {
            index = Math.floor(rng() * len);
            random.push(collection[index]);
            collection.splice(index, 1);
            len -= 1;
            picks -= 1;
        }

        return random;
    }

    return [arr[Math.floor(rng() * arr.length)]];
}

export function removeTrailingSlash(req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    const url = new URL(`${req.url}`, `${req.protocol}://${req.hostname}`);
    if (url.pathname.slice(-1) === "/" && url.pathname.length > 1) {
        let path = url.pathname.slice(0, -1) + url.search;
        reply.redirect(301, path);
    } else done();
}

export function isObjectEmpty(obj: Record<string, any>) {
    return Object.keys(obj).length === 0;
}

export const coloredMethod = (method: string): string => {
    let methods = ` ${method.padEnd(7)} `;

    if (method === "GET") return bgBlue(whiteBright(`${methods}`));
    else if (method === "POST") return bgCyan(whiteBright(`${methods}`));
    else if (method === "PUT") return bgYellow(black(`${methods}`));
    else if (method === "DELETE") return bgRed(whiteBright(`${methods}`));
    else if (method === "PATCH") return bgGreen(whiteBright(`${methods}`));
    else if (method === "HEAD") return bgMagenta(whiteBright(`${methods}`));
    else if (method === "OPTIONS") return bgWhite(black(`${methods}`));
    else return methods;
};
export const coloredStatusCode = (statusCode: number): string => {
    let statusCodes = ` ${String(statusCode).padStart(3)} `;
    if (statusCode >= 200 && statusCode < 300) return bgGreen(whiteBright(`${statusCodes}`));
    else if (statusCode >= 300 && statusCode < 400) return bgWhite(black(`${statusCodes}`));
    else if (statusCode >= 400 && statusCode < 500) return bgYellow(black(`${statusCodes}`));
    else return bgRed(whiteBright(`${statusCodes}`));
};

export const reqLogger = async (req: FastifyRequest, reply: FastifyReply) => {
    let latency = prettyMs(reply.getResponseTime(), { secondsDecimalDigits: 7, millisecondsDecimalDigits: 4 }).padStart(13);
    let clientIp = String(req.ip).padStart(15);
    let statusCode = coloredStatusCode(reply.statusCode);
    let method = coloredMethod(req.method);
    logger.info(`${statusCode} | ${latency} | ${clientIp} | ${method} "${req.url}"`);
    return;
};
