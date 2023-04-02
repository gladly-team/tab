/* eslint-env jest */

import getCharityForCause from '../getCharityForCause'
import CharityModel from '../CharityModel'
import { getMockUserContext } from '../../test-utils'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()

const getMockCharities = () => ({
  id: 'some-charity-id',
  name: 'Some Charity',
  category: 'education',
  logo: 'something.png',
  image: 'something-2.png',
  website: 'example.com',
  description: 'Some description text.',
  impact: 'Some impact text.',
  inactive: false,
  isPermanentPartner: true,
})

const charityId = 'abcd'
const charityIds = ['bcde', 'cdef']

describe('getCharityForCause', () => {
  it('calls the database as expected with charity ID and no charity IDs', async () => {
    expect.assertions(2)

    const mockCharities = getMockCharities()
    const getAllCharitiesSpy = jest
      .spyOn(CharityModel, 'get')
      .mockImplementationOnce(async () => mockCharities)

    const fetchedCharities = await getCharityForCause(
      userContext,
      null,
      charityId
    )
    expect(getAllCharitiesSpy).toHaveBeenCalledWith(userContext, charityId)
    expect(fetchedCharities).toEqual([mockCharities])
  })

  it('returns correct charities when there are charities', async () => {
    expect.assertions(3)

    const mockCharities = getMockCharities()
    const getAllCharitiesSpy = jest
      .spyOn(CharityModel, 'get')
      .mockImplementation(async () => mockCharities)

    const fetchedCharities = await getCharityForCause(
      userContext,
      charityIds,
      charityId
    )
    expect(getAllCharitiesSpy).toHaveBeenCalledWith(userContext, charityIds[0])
    expect(getAllCharitiesSpy).toHaveBeenCalledWith(userContext, charityIds[1])
    expect(fetchedCharities).toEqual([mockCharities, mockCharities])
  })
})
