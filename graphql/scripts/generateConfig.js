const fs = require('fs')
// eslint-disable-next-line import/no-extraneous-dependencies
const mkdirp = require('mkdirp')
const path = require('path')
const config = require('../config')

const configPath = path.join(__dirname, '../build/config.js')
const content = `module.exports = ${JSON.stringify(config)};`

function writeFile(filePath, contents, cb) {
  // Create the directory if it does not exist.
  mkdirp(path.dirname(filePath), err => {
    if (err) {
      cb(err)
      return
    }
    fs.writeFile(filePath, contents, cb)
  })
}

writeFile(configPath, content, err => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    process.exit(1)
  } else {
    // eslint-disable-next-line no-console
    console.log('build/config.js file generated')
  }
})
