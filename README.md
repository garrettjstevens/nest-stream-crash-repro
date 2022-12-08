## Description

[Nest](https://github.com/nestjs/nest) stream error reproducible example

When using a `StreamableFile`, if the stream has an error after the stream has already started piping to the response, the app crashes. Here is the error that is displayed before the crash:

```
_http_outgoing.js:561
    throw new ERR_HTTP_HEADERS_SENT('set');
    ^

Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    at new NodeError (internal/errors.js:322:7)
    at ServerResponse.setHeader (_http_outgoing.js:561:11)
    at ServerResponse.header (/home/garrett/Playground/stream-crash-repro/node_modules/express/lib/response.js:794:10)
    at ServerResponse.send (/home/garrett/Playground/stream-crash-repro/node_modules/express/lib/response.js:174:12)
    at StreamableFile.handleError (/home/garrett/Playground/stream-crash-repro/node_modules/@nestjs/common/file-stream/streamable-file.js:15:21)
    at Transform.<anonymous> (/home/garrett/Playground/stream-crash-repro/node_modules/@nestjs/platform-express/adapters/express-adapter.js:44:22)
    at Object.onceWrapper (events.js:520:26)
    at Transform.emit (events.js:412:35)
    at Transform.afterTransform (internal/streams/transform.js:94:17)
    at Transform.transform [as _transform] (/home/garrett/Playground/stream-crash-repro/dist/app.service.js:29:17) {
  code: 'ERR_HTTP_HEADERS_SENT'
}
```

I ran into this because I am using an `Transform` to transform a stream of database results into a text document that is then sent to the user with `StreamableFile`. If there is an error processing the first "chunk" of the stream, the app handles it as expected. If the error happens on subsequent chunks, though, the app crashes. It looks like `StreamableFile`'s error handler is trying to set something on the response after the response has already started.

## How to see the error

```bash
$ npm install
$ npm run start
$ curl http://localhost:3000
```
