/* eslint-env jest */

import getCharities from '../getCharities'
import CharityModel from '../CharityModel'
import {
  getMockUserContext
} from '../../test-utils'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()

const getMockCharities = () => {
  return [
    {
      id: 'some-charity-id',
      name: 'Some Charity',
      category: 'education',
      logo: 'something.png',
      image: 'something-2.png',
      website: 'example.com',
      description: 'Some description text.',
      impact: 'Some impact text.',
      inactive: false
    },
    {
      id: 'another-charity-id',
      name: 'Another Charity',
      category: 'water',
      logo: 'another-thing.png',
      image: 'another-thing-2.png',
      website: 'example.com',
      description: 'Another description text.',
      impact: 'Another impact text.',
      inactive: false
    },
    {
      id: 'third-charity-id',
      name: 'Third Charity',
      category: 'water',
      logo: 'third-charity.png',
      image: 'third-charity-2.png',
      website: 'example.com',
      description: 'Third charity description text.',
      impact: 'Third charity impact text.'
      // inactive: false // Note: inactive key isn't required
    }
  ]
}

describe('getCharities', () => {
  it('calls the database as expected', async () => {
    expect.assertions(1)

    const mockCharities = getMockCharities()
    const getAllCharitiesSpy = jest.spyOn(CharityModel, 'getAll')
      .mockImplementationOnce(async () => mockCharities)

    await getCharities(userContext)
    expect(getAllCharitiesSpy).toHaveBeenCalledWith(userContext)
  })

  it('returns all charities when all are active', async () => {
    expect.assertions(1)

    const mockCharities = getMockCharities()
    jest.spyOn(CharityModel, 'getAll')
      .mockImplementationOnce(async () => mockCharities)

    const fetchedCharities = await getCharities(userContext)
    expect(fetchedCharities).toEqual(mockCharities)
  })

  it('returns only active charities when some are inactive', async () => {
    expect.assertions(1)

    const mockCharities = getMockCharities()
    mockCharities[1].inactive = true

    jest.spyOn(CharityModel, 'getAll')
      .mockImplementationOnce(async () => mockCharities)
    const fetchedCharities = await getCharities(userContext)

    const expectedCharities = [mockCharities[0], mockCharities[2]]
    expect(fetchedCharities).toEqual(expectedCharities)
  })

  it('returns only active charities when some are inactive', async () => {
    expect.assertions(1)

    const mockCharities = getMockCharities()
    mockCharities[1].inactive = true

    jest.spyOn(CharityModel, 'getAll')
      .mockImplementationOnce(async () => mockCharities)
    const fetchedCharities = await getCharities(userContext)

    const expectedCharities = [mockCharities[0], mockCharities[2]]
    expect(fetchedCharities).toEqual(expectedCharities)
  })

  it('returns an empty array when all charities are inactive', async () => {
    expect.assertions(1)

    const mockCharities = getMockCharities()
    mockCharities.forEach(charity => {
      charity.inactive = true
    })

    jest.spyOn(CharityModel, 'getAll')
      .mockImplementationOnce(async () => mockCharities)
    const fetchedCharities = await getCharities(userContext)

    const expectedCharities = []
    expect(fetchedCharities).toEqual(expectedCharities)
  })
})
