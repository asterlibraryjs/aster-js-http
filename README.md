# @aster-js/http

## Main concept

This library introduce an `HttpClient` that works using an execution pipeline through chain of `IRequestHandler`.

It also use a core concept of `@aster-js/async`: `AbortToken`. They are used through the pipeline allowing to cancel any pipeline that still run.

```ts
// You can provide your own root RequestHandler, very use full for Unit Testing
const httpClient = new HttpClient()
    // Sync or async configuration
    .configure(async options => {
        options.headers = {
            "Content-Type": await AuthorizationManager.getToken()
        };
    })
    // Multiple RequestHandler implementation:
    // timeout, caching, dynamic configuration or custom implementations
    .use(TimeoutRequestHandler, 30 * 1000);



httpClient.get("/data", HttpBody.json())
```

## Resiliency

[@aster-js/resilient](https://github.com/asterlibraryjs/aster-js-resilient#readme) provide a `ResilientRequestHandler` that provide advance way to handle retrys.