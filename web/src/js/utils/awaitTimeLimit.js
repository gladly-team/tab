import { AwaitedPromiseTimeout } from 'js/utils/errors'

/**
 * Await a Promise for up to a specified amount of time, then reject if
 * the Promise has not resolved.
 * @param {Promise} promiseToAwait - A Promise to await
 * @param {Number} timeLimitMs - How many milliseconds to wait for
 *   promiseToAwait to resolve.
 * @return {Promise<Any>} The resolve/reject value of promiseToAwait, or an
 *   error.
 */
const awaitTimeLimit = async (promiseToAwait, timeLimitMs) =>
  new Promise((resolve, reject) => {
    promiseToAwait
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        reject(err)
      })
    setTimeout(() => {
      reject(new AwaitedPromiseTimeout())
    }, timeLimitMs)
  })

export default awaitTimeLimit
