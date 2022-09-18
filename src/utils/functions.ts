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
