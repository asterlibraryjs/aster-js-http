import { AbortToken } from "@aster-js/async";
import { IRequestHandler, RequestOptions } from "./irequest-handler";
import { DelegatingRequestHandler } from "./delegating-request-handler";

export class ConfigureRequestHandler extends DelegatingRequestHandler {
    private readonly _configureRequest: (init: RequestInit) => Promise<void> | void;

    constructor(innerHandler: IRequestHandler, configureRequest: (init: RequestInit) => Promise<void> | void) {
        super(innerHandler);
        this._configureRequest = configureRequest;
    }

    async fetch(input: RequestInfo, options: RequestOptions, token: AbortToken): Promise<Response> {
        await this._configureRequest(options);
        return super.fetch(input, options, token);
    }
}
