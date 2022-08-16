/* eslint-disable no-unused-vars */
/* globals globalThis */

// A global `fetch`` is expected for use in `next-firebase-auth`:
// https://github.com/node-fetch/node-fetch#providing-global-access
import fetch, {
  Blob,
  blobFrom,
  blobFromSync,
  File,
  fileFrom,
  fileFromSync,
  FormData,
  Headers,
  Request,
  Response,
} from 'node-fetch'

if (!globalThis.fetch) {
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
}
