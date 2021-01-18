import { AbortToken } from "@aster-js/async";
import { DelegatingRequestHandler } from "./delegating-request-handler";
import { IRequestHandler, RequestOptions } from "./irequest-handler";

export class TimeoutRequestHandler extends DelegatingRequestHandler {
    private readonly _timeout: number;

    get timeout(): number { return this._timeout; }

    constructor(innerHandler: IRequestHandler, timeout: number) {
        super(innerHandler);
        this._timeout = timeout;
    }

    async fetch(input: RequestInfo, options: RequestOptions, token: AbortToken): Promise<Response> {
        const timeoutToken = AbortToken.create(token);
        setTimeout(
            () => timeoutToken.abort(`Operation timeout after ${this._timeout}`),
            this._timeout
        );
        return super.fetch(input, options, timeoutToken);
    }
}
