/* eslint-env jest */
import { join } from 'path'
import { readFileSync } from 'fs'
// import fileContentsReader from '../fileContentsReader'

// jest.mock('path')
jest.mock('fs')

beforeEach(() => {
  // join.mockImplementation((_, ...otherArgs) => {
  //   const mockDirName = '/some/mock/directory/'
  //   return [mockDirName, ...otherArgs].join('')
  // })
  // global.__dirname = 'foo'
})

describe('fileContentsReader', () => {
  it('calls readFileSync with the expected path', () => {
    readFileSync.mockReturnValue('foo')
    const fileContentsReader = require('../fileContentsReader').default
    const reader = fileContentsReader('some-slug')
    reader('some-filename.md')
    const expectedFilePath = join(
      __dirname,
      '../',
      'causes',
      'some-slug',
      'some-filename.md'
    )
    expect(readFileSync).toHaveBeenCalledWith(expectedFilePath, 'utf-8')
  })

  it('returns file contents', () => {
    readFileSync.mockReturnValue('foo')
    const fileContentsReader = require('../fileContentsReader').default
    const reader = fileContentsReader('some-slug')
    expect(reader('some-filename.md')).toEqual('foo')
  })

  it('trims white space at the beginning and end of file contents', () => {
    readFileSync.mockReturnValue('\n\n ##### Hi there! \n\n')
    const fileContentsReader = require('../fileContentsReader').default
    const reader = fileContentsReader('some-slug')
    expect(reader('some-filename.md')).toEqual('##### Hi there!')
  })
})
