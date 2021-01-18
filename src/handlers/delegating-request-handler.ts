import { AbortToken } from "@aster-js/async";
import { IRequestHandler, RequestOptions } from "./irequest-handler";

export interface DelegatingHandlerConstructor<T extends DelegatingRequestHandler = DelegatingRequestHandler, TArgs extends any[] = any[]> {
    new(innerHandler: IRequestHandler, ...args: TArgs): T;
}

export abstract class DelegatingRequestHandler implements IRequestHandler {
    private readonly _innerHandler: IRequestHandler;

    get innerHandler(): IRequestHandler { return this._innerHandler; }

    constructor(innerHandler: IRequestHandler) {
        this._innerHandler = innerHandler;
    }

    fetch(input: RequestInfo, options: RequestOptions, token: AbortToken): Promise<Response> {
        return this._innerHandler.fetch(input, options, token);
    }
}
