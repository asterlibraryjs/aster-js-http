import { TaskController, AbortToken } from "@aster-js/async";
import { ConfigureRequestHandler } from "./handlers/configure-request-handler";
import { DelegatingHandlerConstructor, DelegatingRequestHandler } from "./handlers/delegating-request-handler";
import { IRequestHandler, RequestHandler, RequestOptions } from "./handlers/irequest-handler";
import { HttpBody } from "./http-body";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type HttpClientOptions = {
    readonly baseAddress?: string;
    readonly defaultHeaders?: Record<string, string>;
}

/** Represents an client for easy use of http transactions */
export class HttpClient {
    private readonly _options: HttpClientOptions;
    private readonly _initializers: TaskController;
    private _requestHandler!: IRequestHandler;

    constructor(options: HttpClientOptions = {}, requestHandler?: IRequestHandler) {
        this._options = options;
        this._initializers = new TaskController();
        this.setRequestHandler(requestHandler ?? new RequestHandler());
    }

    use<T extends DelegatingRequestHandler, TArgs extends any[]>(ctor: DelegatingHandlerConstructor<T, TArgs>, ...args: TArgs): this {
        const requestHandler = new ctor(this._requestHandler, ...args);
        this.setRequestHandler(requestHandler);
        return this;
    }

    configure(configureRequest: (options: RequestOptions) => Promise<void> | void): this {
        const requestHandler = new ConfigureRequestHandler(this._requestHandler, configureRequest);
        this.setRequestHandler(requestHandler);
        return this;
    }

    protected setRequestHandler(handler: IRequestHandler): void {
        this._requestHandler = handler;
        if (handler.init) {
            this._initializers.run(handler.init, handler);
        }
    }

    get(url: string | URL, headers: Record<string, string> | null = null, token?: AbortToken): Promise<Response> {
        return this.fetch(url, "GET", null, headers, token);
    }

    post(url: string | URL, data: HttpBody, headers: Record<string, string> | null = null, token?: AbortToken): Promise<Response> {
        return this.fetch(url, "POST", data, headers, token);
    }

    put(url: string | URL, data: HttpBody, headers: Record<string, string> | null = null, token?: AbortToken): Promise<Response> {
        return this.fetch(url, "PUT", data, headers, token);
    }

    delete(url: string | URL, data: HttpBody, headers: Record<string, string> | null = null, token?: AbortToken): Promise<Response> {
        return this.fetch(url, "DELETE", data, headers, token);
    }

    async fetch(uri: string | URL, method: HttpMethod, body: HttpBody | null, headers: Record<string, string> | null, token?: AbortToken): Promise<Response> {
        if (this._initializers.remaing) await this._initializers.whenAll();

        const url = this.resolveUrl(uri);

        headers = { ...this._options.defaultHeaders, ...headers };

        const requestInit: RequestInit = { headers, method };
        if (body) {
            headers["Content-Type"] = body.contentType;
            requestInit.body = body.content();
        }
        return this._requestHandler.fetch(url.toString(), requestInit, token ?? AbortToken.none);
    }

    private resolveUrl(uri: string | URL): URL {
        if (uri instanceof URL) return uri;

        if (this._options.baseAddress) {
            return new URL(uri, this._options.baseAddress);
        }

        return new URL(uri);
    }
}
