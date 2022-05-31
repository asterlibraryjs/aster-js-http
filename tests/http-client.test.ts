import { assert } from "chai";
import { assert as sassert, stub } from "sinon";
import { HttpClient } from "../src/http-client";

describe("HttpClient", () => {

    it("Should a new HttpClient", async () => {
        const expected = new Response();
        const fetchStub = stub().returns(expected);
        const client = new HttpClient({ baseAddress: "https://aster.js/" }, { fetch: fetchStub });

        const result = await client.get("/hello");

        sassert.calledOnce(fetchStub);
        assert.equal(fetchStub.args[0][0], "https://aster.js/hello")
        assert.equal(result, expected);
    });
});
