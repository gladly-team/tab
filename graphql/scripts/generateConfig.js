const fs = require('fs')
var mkdirp = require('mkdirp')
const path = require('path')
const config = require('../config')

const configPath = path.join(__dirname, '../build/config.js')
const content = 'module.exports = ' + JSON.stringify(config) + ';'

function writeFile(filePath, contents, cb) {
  // Create the directory if it does not exist.
  mkdirp(path.dirname(filePath), function(err) {
    if (err) return cb(err)

    fs.writeFile(filePath, contents, cb)
  })
}

writeFile(configPath, content, function(err) {
  if (err) {
    console.log(err)
    process.exit(1)
  } else {
    console.log('build/config.js file generated')
  }
})
