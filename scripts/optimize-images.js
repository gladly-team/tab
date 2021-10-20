// A "this works for now" way to process/format new background
// images. The category is hardcoded.
// To use: node optimize-images.js ~/folder-with-photos/

/* eslint import/no-extraneous-dependencies: 0 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const uuid = require('uuid').v4

// Expect one argument, the input directory.
const args = process.argv.slice(2)
const dirRaw = args[0]
if (!dirRaw) {
  throw new Error('The first argument should be the images directory.')
}
const dir = path.resolve(dirRaw)
const outDir = path.join(dir, '../', `${path.basename(dir)}-edited`)
const processTime = new Date().toISOString()

// https://github.com/lovell/sharp
const formatImg = async (imgFilePath, newFileName) => {
  console.log(`Formatting image: ${imgFilePath}`)
  const newImgWidth = 2000

  // Resizing:
  // https://sharp.pixelplumbing.com/api-resize#resize
  // JPEG options:
  // https://sharp.pixelplumbing.com/api-output#jpeg
  const newFilePath = path.join(outDir, newFileName)

  console.log(`Saving as: ${newFilePath}`)

  await sharp(imgFilePath)
    .resize({
      width: newImgWidth,
    })
    .jpeg()
    .toFile(newFilePath)
}

// Takes a file, saves a new image, returns a fixture.
const processImage = async fileName => {
  const id = uuid()
  const newFileName = `${id}.jpg`
  await formatImg(path.join(dir, fileName), newFileName)
  return {
    id,
    image: newFileName,
    category: 'seas', // change or add input var as needed
    created: processTime,
    updated: processTime,
  }
}

const processImages = async () => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }

  const files = await fs.promises.readdir(dir)
  const fixtures = await Promise.all(
    files.map(fileName => processImage(fileName))
  )

  // Save the fixtures to file.
  fs.writeFileSync(
    path.join(outDir, 'fixtures.json'),
    JSON.stringify(fixtures, null, 4),
    'utf8'
  )
}

const main = () => {
  console.log(`Starting image optimization for images in directory: ${dir}`)
  console.log(`Will save to: ${outDir}`)
  processImages()
}

main()
