const fs = require('fs')
const path = require('path')

// Expect one argument
const args = process.argv.slice(2)
const dirRaw = args[0]
if (!dirRaw) {
  throw new Error('The first argument should be the images directory.')
}
const dir = path.resolve(dirRaw)
console.log(`Starting image optimization for images in directory: ${dir}`)
const outDir = path.join(dir, '../', `${path.basename(dir)}-edited`)
console.log(`Will save to: ${outDir}`)

// https://github.com/lovell/sharp
const formatImg = async imgFilePath => {
  console.log(`Formatting image: ${imgFilePath}`)

  // Resizing:
  // https://sharp.pixelplumbing.com/api-resize#resize
  // Width: 2000px

  // JPEG options:
  // https://sharp.pixelplumbing.com/api-output#jpeg

  // TODO: save as UUID file
}

const processImages = async () => {
  const files = await fs.promises.readdir(dir)
  // TODO
}

processImages()
