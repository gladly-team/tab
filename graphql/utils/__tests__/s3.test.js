/* eslint-env jest */

jest.mock('aws-sdk', () => {
  const mockGetSignedUrl = jest.fn()
  return {
    S3: jest.fn(() => ({
      getSignedUrl: mockGetSignedUrl,
    })),
    mockGetSignedUrl,
  }
})

jest.mock('../../config', () => ({
  STAGE: 'test',
  AWS_REGION: 'us-west-2',
}))

describe('s3 utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPrivateBackgroundSignedUrl', () => {
    it('generates a signed URL with correct bucket and key', () => {
      const AWS = require('aws-sdk')
      AWS.mockGetSignedUrl.mockReturnValue(
        'https://gladly-private-test.s3.amazonaws.com/users/abc/bg.jpg?signed=true'
      )

      const { getPrivateBackgroundSignedUrl } = require('../s3')
      const result = getPrivateBackgroundSignedUrl('users/abc/bg.jpg')

      expect(AWS.mockGetSignedUrl).toHaveBeenCalledWith('getObject', {
        Bucket: 'gladly-private-test',
        Key: 'users/abc/bg.jpg',
        Expires: 900,
      })
      expect(result).toBe(
        'https://gladly-private-test.s3.amazonaws.com/users/abc/bg.jpg?signed=true'
      )
    })

    it('uses the correct stage for bucket name', () => {
      const AWS = require('aws-sdk')
      AWS.mockGetSignedUrl.mockReturnValue('https://signed-url.com')

      const { getPrivateBackgroundSignedUrl } = require('../s3')
      getPrivateBackgroundSignedUrl('some/path.jpg')

      expect(AWS.mockGetSignedUrl).toHaveBeenCalledWith(
        'getObject',
        expect.objectContaining({
          Bucket: 'gladly-private-test',
        })
      )
    })

    it('sets expiration to 15 minutes (900 seconds)', () => {
      const AWS = require('aws-sdk')
      AWS.mockGetSignedUrl.mockReturnValue('https://signed-url.com')

      const { getPrivateBackgroundSignedUrl } = require('../s3')
      getPrivateBackgroundSignedUrl('some/path.jpg')

      expect(AWS.mockGetSignedUrl).toHaveBeenCalledWith(
        'getObject',
        expect.objectContaining({
          Expires: 900,
        })
      )
    })
  })

  describe('getPublicBackgroundUrl', () => {
    it('constructs the correct public URL', () => {
      const { getPublicBackgroundUrl } = require('../s3')
      const result = getPublicBackgroundUrl(
        'abe51098-8ebe-4f85-a637-1bd7d2ee94dd.jpg'
      )
      expect(result).toBe(
        'https://prod-tab2017-media.gladly.io/img/backgrounds/abe51098-8ebe-4f85-a637-1bd7d2ee94dd.jpg'
      )
    })

    it('handles filenames with special characters', () => {
      const { getPublicBackgroundUrl } = require('../s3')
      const result = getPublicBackgroundUrl('my-photo_2025.jpeg')
      expect(result).toBe(
        'https://prod-tab2017-media.gladly.io/img/backgrounds/my-photo_2025.jpeg'
      )
    })
  })

  describe('getDailyCollectionBackgroundUrl', () => {
    it('constructs the correct daily collection URL', () => {
      const { getDailyCollectionBackgroundUrl } = require('../s3')
      const result = getDailyCollectionBackgroundUrl('landscapes')
      expect(result).toBe(
        'https://tab.gladly.io/v5/backgrounds/collection/landscapes/today/image.jpg'
      )
    })

    it('converts collection name to lowercase slug', () => {
      const { getDailyCollectionBackgroundUrl } = require('../s3')
      const result = getDailyCollectionBackgroundUrl('Black Photographers')
      expect(result).toBe(
        'https://tab.gladly.io/v5/backgrounds/collection/black-photographers/today/image.jpg'
      )
    })

    it('replaces spaces with hyphens in collection name', () => {
      const { getDailyCollectionBackgroundUrl } = require('../s3')
      const result = getDailyCollectionBackgroundUrl('nature scenes')
      expect(result).toBe(
        'https://tab.gladly.io/v5/backgrounds/collection/nature-scenes/today/image.jpg'
      )
    })

    it('handles collection names that are already slugified', () => {
      const { getDailyCollectionBackgroundUrl } = require('../s3')
      const result = getDailyCollectionBackgroundUrl('trees')
      expect(result).toBe(
        'https://tab.gladly.io/v5/backgrounds/collection/trees/today/image.jpg'
      )
    })
  })
})
