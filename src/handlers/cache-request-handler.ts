import { AbortToken } from "@aster-js/async";
import { asserts } from "@aster-js/core";
import { DelegatingRequestHandler } from "./delegating-request-handler";
import { IRequestHandler, RequestOptions } from "./irequest-handler";

export class CacheRequestHandler extends DelegatingRequestHandler {
    private _cache?: Cache;

    constructor(
        innerHandler: IRequestHandler,
        private readonly _cacheName: string,
        private readonly _options?: CacheQueryOptions
    ) {
        super(innerHandler);
    }

    async init(_token: AbortToken): Promise<void> {
        this._cache = await caches.open(this._cacheName);
    }

    async fetch(input: RequestInfo, options: RequestOptions, token: AbortToken): Promise<Response> {
        asserts.ensure(this._cache);

        const req = new Request(input, options);

        let res = await this._cache.match(req, this._options);
        if (res) return res;

        res = await super.fetch(req, {}, token);
        await this._cache.put(req, res);

        return res;
    }
}
