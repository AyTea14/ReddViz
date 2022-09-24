import { bgBlue, bgCyan, bgGreen, bgMagenta, bgRed, bgWhite, bgYellow, black, whiteBright } from "colorette";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { Meme } from "../types";

export function removeNonImagePosts(memes: Meme[] | null) {
    let onlyImagePosts = [];
    if (Array.isArray(memes)) {
        for (let meme of memes) {
            let url = meme.image;
            if (
                !url?.includes(".gifv") &&
                (url?.includes(".jpg") || url?.includes(".png") || url?.includes(".gif") || url?.includes(".jpeg"))
            )
                onlyImagePosts.push(meme);
        }
    }
    return onlyImagePosts;
}

export function getNRandomMemes<T>(arr: Array<T>, picks: number): Array<T> {
    if (!Array.isArray(arr)) throw new Error("getNRandomMemes() expect an array as parameter.");

    let rng = Math.random;
    if (typeof picks === "number" && picks > 1) {
        let len: number = arr.length,
            collection = arr.slice(),
            random: Array<T> = [],
            index;

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

export function formatJSON(payload: unknown, indent: number = 3) {
    return JSON.stringify(payload, undefined, indent);
}

export function removeTrailingSlash(req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    const url = new URL(`${req.url}`, `${req.protocol}://${req.hostname}`);
    if (url.pathname.slice(-1) === "/" && url.pathname.length > 1) {
        let path = url.pathname.slice(0, -1) + url.search;
        reply.redirect(301, path);
    } else done();
}

export const coloredMethod = (method: string): string => {
    let methods = ` ${method.padEnd(7)} `;
    switch (method) {
        case "GET":
            return bgBlue(whiteBright(`${methods}`));
        case "POST":
            return bgCyan(whiteBright(`${methods}`));
        case "PUT":
            return bgYellow(black(`${methods}`));
        case "DELETE":
            return bgRed(whiteBright(`${methods}`));
        case "PATCH":
            return bgGreen(whiteBright(`${methods}`));
        case "HEAD":
            return bgMagenta(whiteBright(`${methods}`));
        case "OPTIONS":
            return bgWhite(black(`${methods}`));
        default:
            return method;
    }
};
export const coloredStatusCode = (statusCode: number | string): string => {
    let statusCodes = ` ${String(statusCode).padStart(3)} `;
    if (statusCode >= 200 && statusCode < 300) return bgGreen(whiteBright(`${statusCodes}`));
    else if (statusCode >= 300 && statusCode < 400) return bgWhite(black(`${statusCodes}`));
    else if (statusCode >= 400 && statusCode < 500) return bgYellow(black(`${statusCodes}`));
    else return bgRed(whiteBright(`${statusCodes}`));
};
