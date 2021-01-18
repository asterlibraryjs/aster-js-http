import { AbortToken } from "@aster-js/async";

export type RequestOptions = Omit<RequestInit, "signal">;

export interface IRequestHandler {

    init?(token: AbortToken): Promise<void>;

    fetch(input: RequestInfo, options: RequestOptions, token: AbortToken): Promise<Response>;
}

export class RequestHandler implements IRequestHandler {

    async fetch(input: RequestInfo, options: RequestOptions, token: AbortToken): Promise<Response> {
        token.throwIfAborted();

        const init = { ...options, signal: token.signal };
        return await fetch(input, init);
    }
}