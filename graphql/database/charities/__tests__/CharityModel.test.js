/* eslint-env jest */

import tableNames from '../../tables'
import Charity from '../CharityModel'
import config from '../../../config'

const mediaRoot = config.S3_ENDPOINT

jest.mock('../../databaseClient')

afterEach(() => {
  jest.resetAllMocks()
})

describe('CharityModel', () => {
  it('implements the name property', () => {
    expect(Charity.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(Charity.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(Charity.tableName).toBe(tableNames['charities'])
  })

  it('constructs as expected', () => {
    const charityInfo = {
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'A Charity',
      category: 'Something',
      logo: 'my-logo.jpg',
      image: 'my-img.jpg',
      website: 'https://example.com',
      description: 'Info here.',
      impact: ''
    }
    const item = Object.assign({}, new Charity(charityInfo))
    expect(item).toEqual(Object.assign({}, charityInfo, {
      logo: `${mediaRoot}/img/charities/charity-logos/my-logo.jpg`,
      image: `${mediaRoot}/img/charities/charity-post-donation-images/my-img.jpg`
    }))
  })
})
