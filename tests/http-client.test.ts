import { AbortToken } from "@aster-js/async";
import { sleep } from "@aster-js/async/lib/helpers";
import { assert } from "chai";
import { assert as sassert, stub } from "sinon";
import { RequestOptions } from "../src";
import { HttpClient } from "../src/http-client";

describe("HttpClient", () => {

    it("Should run a basic get", async () => {
        const expected = new Response();
        const fetchStub = stub().returns(expected);
        const client = new HttpClient({ baseAddress: "https://aster.js/" }, { fetch: fetchStub });

        const result = await client.get("/hello");

        sassert.calledOnce(fetchStub);

        const [input, options, token] = fetchStub.args[0] as [RequestInfo, RequestOptions, AbortToken];
        assert.equal(input, "https://aster.js/hello");
        assert.equal(options.method, "GET");
        assert.equal(token, AbortToken.none);
        assert.equal(result, expected);
    });

    it("Should run add headers through configure", async () => {
        const fetchStub = stub().returns(new Response());
        const client = new HttpClient({ baseAddress: "https://aster.js/" }, { fetch: fetchStub });
        client.configure(opts => { opts.headers = { ...opts.headers, "x-bob": "nob" }; });

        await client.get("/hello");

        sassert.calledOnce(fetchStub);

        const [, options] = fetchStub.args[0] as [RequestInfo, RequestOptions, AbortToken];
        assert.deepEqual(options.headers, { "x-bob": "nob" });
    });

    it("Should run add headers through defaultHeaders", async () => {
        const fetchStub = stub().returns(new Response());
        const client = new HttpClient({
            baseAddress: "https://aster.js/",
            defaultHeaders: { "x-bob": "nob" }
        }, { fetch: fetchStub });

        await client.get("/hello");

        sassert.calledOnce(fetchStub);

        const [, options] = fetchStub.args[0] as [RequestInfo, RequestOptions, AbortToken];
        assert.deepEqual(options.headers, { "x-bob": "nob" });
    });

    it("Should override default headers", async () => {
        const fetchStub = stub().returns(new Response());
        const client = new HttpClient({
            baseAddress: "https://aster.js/",
            defaultHeaders: { "x-bob": "nob" }
        }, { fetch: fetchStub });
        client.configure(opts => { opts.headers = { ...opts.headers, "x-bob": "mob" }; });

        await client.get("/hello");

        sassert.calledOnce(fetchStub);

        const [, options] = fetchStub.args[0] as [RequestInfo, RequestOptions, AbortToken];
        assert.deepEqual(options.headers, { "x-bob": "mob" });
    });

    it("Should override default headers", async () => {
        const fetchStub = stub().returns(new Response());
        const initStub = stub().returns(sleep(100));
        const client = new HttpClient({ baseAddress: "https://aster.js/" }, { init: initStub, fetch: fetchStub });

        await client.get("/hello");

        sassert.calledOnce(initStub);
        sassert.calledOnce(fetchStub);

        sassert.callOrder(initStub, fetchStub);
    });
});
