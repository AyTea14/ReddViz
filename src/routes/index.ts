// import { NextFunction, Request, Response } from "express";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { nRandomPostsFromSub } from "./nRandomPostsFromSub.js";
import { oneRandomMeme } from "./oneRandomMeme.js";
import { subredditOrCount } from "./subredditOrCount.js";

export const routes = (server: FastifyInstance) => {
    server.get("/", homePage);

    server
        .route({ url: "/gimme", method: "GET", handler: oneRandomMeme })
        .route({ url: "/gimme/:interface", method: "GET", handler: subredditOrCount })
        .route({ url: "/gimme/:interface/:count", method: "GET", handler: nRandomPostsFromSub });
};

function homePage(_res: FastifyRequest, reply: FastifyReply) {
    reply.send(
        "Welcome to MemeAPI! For documentation and info go to https://github.com/AyTea14/MemeApiTS and if you want to use it, just add /gimme at the end of the url"
    );
}
