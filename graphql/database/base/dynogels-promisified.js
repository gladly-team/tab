'use strict'

// From:
// https://github.com/andrewoh531/dynogels-promisified
// https://github.com/andrewoh531/dynogels-promisified/blob/master/index.js

var Promise = require('bluebird')
var dynogels = require('dynogels')

Promise.promisifyAll(require('dynogels/lib/table').prototype)
Promise.promisifyAll(require('dynogels/lib/item').prototype)
Promise.promisifyAll(require('dynogels/lib/query').prototype)
Promise.promisifyAll(require('dynogels/lib/scan').prototype)
Promise.promisifyAll(require('dynogels/lib/parallelScan').prototype)

var dynogelsModel = dynogels.model
dynogels.model = function (name, model) {
  if (model) { Promise.promisifyAll(model) }
  return dynogelsModel.apply(dynogels, arguments)
}

Promise.promisifyAll(dynogels)

module.exports = dynogels
