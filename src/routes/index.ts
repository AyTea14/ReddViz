import { NextFunction, Request, Response } from "express";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { nRandomPostsFromSub } from "./nRandomPostsFromSub.js";
import { oneRandomMeme } from "./oneRandomMeme.js";
import { subredditOrCount } from "./subredditOrCount.js";
export const routes = (server: FastifyInstance) => {
    server.get("/", homePage);

    server.use(removeTrailingSlash);

    server
        .route({ url: "/gimme", method: "GET", handler: oneRandomMeme })
        .route({ url: "/gimme/:interface", method: "GET", handler: subredditOrCount })
        .route({ url: "/gimme/:interface/:count", method: "GET", handler: nRandomPostsFromSub });
};

function homePage(_res: FastifyRequest, reply: FastifyReply) {
    reply.send(
        "Welcome to MemeAPI! For documentation and info go to https://github.com/D3vD/Meme_Api and if you want to use it, just add /gimme at the end of the url"
    );
}

function removeTrailingSlash(req: Request, res: Response, next: NextFunction) {
    if (req.path.slice(-1) == "/" && req.path.length > 1) {
        let query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else next();
}
