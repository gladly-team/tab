// From:
// https://github.com/andrewoh531/dynogels-promisified
// https://github.com/andrewoh531/dynogels-promisified/blob/master/index.js

const Promise = require('bluebird')
const dynogels = require('dynogels')

Promise.promisifyAll(require('dynogels/lib/table').prototype)
Promise.promisifyAll(require('dynogels/lib/item').prototype)
Promise.promisifyAll(require('dynogels/lib/query').prototype)
Promise.promisifyAll(require('dynogels/lib/scan').prototype)
Promise.promisifyAll(require('dynogels/lib/parallelScan').prototype)

const dynogelsModel = dynogels.model
dynogels.model = function modelFunc(name, model, ...args) {
  if (model) {
    Promise.promisifyAll(model)
  }
  return dynogelsModel.apply(dynogels, [name, model, ...args])
}

Promise.promisifyAll(dynogels)

module.exports = dynogels
