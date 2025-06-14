# Firefox/Playwright waitForResponse() Issue Reproduction

This project demonstrates a change in behavior of the `page.waitForResponse()` method in Playwright, specifically with Firefox, starting from version 1.52.0.

## Description

The test in this project is designed to highlight a functional difference in how `page.waitForResponse()` is handled in Firefox compared to other browsers when dealing with Cross-Origin Resource Sharing (CORS) requests.

-   **Passing versions:** The test successfully passes with Playwright versions up to and including 1.51.1.
-   **Failing versions:** The test fails with Playwright version 1.52.0 and any subsequent versions.

## The Issue

The test initiates a cross-origin `POST` request from the browser client. According to CORS protocol, the browser first sends a preflight `OPTIONS` request to the server to check if the actual `POST` request is safe to send.

The core of the issue is how `page.waitForResponse()` behaves in different Playwright versions with Firefox:

-   **Expected Behavior (and behavior before v1.52.0):** The `page.waitForResponse()` method, when waiting for a response from the `/api/test` endpoint, correctly resolves with the response to the `POST` request, ignoring the initial `OPTIONS` preflight request.

-   **Actual Behavior (in Firefox with v1.52.0+):** The `page.waitForResponse()` method prematurely resolves with the response to the `OPTIONS` request instead of the `POST` request. This causes the test to fail because the assertion expects the response's method to be `POST`, but it receives `OPTIONS`.

This change in behavior is specific to the Firefox browser and was introduced between Playwright versions 1.51.1 and 1.52.0.

## How to run the test

1.  Install the dependencies:
    ```bash
    npm install
    ```
2.  Run the Playwright test:
    ```bash
    npx playwright test
    ```

You can change the Playwright version in `package.json` to observe the difference in behavior.

## Workaround
Don't use the simple regexp matching in `page.waitForResponse`, always specify the method.

```typescript
const postResponsePromise = page.waitForResponse(
    (response) =>
        response.request().method() === 'POST' &&
        /localhost:3001/.test(response.url()),
);
```
