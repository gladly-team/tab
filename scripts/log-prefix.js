// Add prefixes to logs to know which service they're coming from.

const log = require("npmlog")
const readline = require("readline")

// Expect two arguments, a prefix string and a color string.
const args = process.argv.slice(2)
var heading = args[0] || ""
const headingColor = args[1] || "black"

// Set log heading and styling.

// Consistent width for headers
const HEADER_CHAR_MIN_LENGTH = 9
while (heading.length < HEADER_CHAR_MIN_LENGTH) {
  heading += " "
}
log.heading = heading
log.headingStyle = {
  fg: headingColor,
  bold: false,
}

// Creating our own log level simply to hide thelog level prefix in output.
log.addLevel("all", 2500, {}, "")

const rl = readline.createInterface({
  input: process.stdin,
})

rl.on("line", function(line) {
  log.all("", line)
})
