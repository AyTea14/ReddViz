import { bgGreen, bgWhite, bgMagenta, bgYellow, bgBlue, bgCyan, bgRed, whiteBright, black } from "colorette";
import { Request, Response } from "express";
import morgan from "morgan";
import prettyMs from "pretty-ms";
import dayjs from "dayjs";
import timeZone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
dayjs.extend(timeZone);

export const morganMiddleware = morgan((tokens, req: Request, res: Response) => {
    let latency: string = tokens["response-time"](req, res)!
        ? prettyMs(parseFloat(tokens["response-time"](req, res, 4)!), { secondsDecimalDigits: 7, millisecondsDecimalDigits: 4 })
        : " - ";
    let method = tokens.method(req, res)?.toUpperCase() || " - ";
    let statusCode = tokens.status(req, res) || " - ";
    let url = tokens.url(req, res) || " - ";
    let clientIP = req.ip || " - ";
    let time = dayjs().tz("asia/kuala_lumpur").format("YYYY/MM/DD - HH:mm:ss");

    statusCode = coloredStatusCode(statusCode);
    method = coloredMethod(method);

    latency = latency.padStart(13);
    clientIP = clientIP.padStart(15);

    return `[LOG] ${time} |${statusCode}| ${latency} | ${clientIP} |${method} "${url}"`;
});

const coloredMethod = (method: string): string => {
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
const coloredStatusCode = (statusCode: number | string): string => {
    let statusCodes = ` ${String(statusCode).padStart(3)} `;
    if (statusCode >= 200 && statusCode < 300) return bgGreen(whiteBright(`${statusCodes}`));
    else if (statusCode >= 300 && statusCode < 400) return bgWhite(black(`${statusCodes}`));
    else if (statusCode >= 400 && statusCode < 500) return bgYellow(black(`${statusCodes}`));
    else return bgRed(whiteBright(`${statusCodes}`));
};
