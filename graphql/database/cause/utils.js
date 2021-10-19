import { join } from 'path'
import { readFileSync } from 'fs'

const getFileContents = (basePath, fileName) =>
  readFileSync(join(basePath, fileName), 'utf-8')

// A helper to be called from within a cause data folder,
// initialized with the ID (folder name) of the cause.
// eslint-disable-next-line import/prefer-default-export
export const fileGetter = causeSlug => {
  return fileName => {
    const basePath = join(__dirname, 'causes', causeSlug)
    return getFileContents(basePath, fileName)
  }
}
