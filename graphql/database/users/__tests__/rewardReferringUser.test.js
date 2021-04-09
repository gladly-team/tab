/* eslint-env jest */

import ReferralDataModel from '../../referrals/ReferralDataModel'
import rewardReferringUser from '../rewardReferringUser'
import addVc from '../addVc'
import addUsersRecruited from '../addUsersRecruited'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  getMockUserImpact,
  getMockUserInstance,
  getMockUserImpactInstance,
  setMockDBResponse,
  clearAllMockDBResponses,
} from '../../test-utils'
import { DatabaseItemDoesNotExistException } from '../../../utils/exceptions'
import UserImpactModel from '../../userImpact/UserImpactModel'
import {
  getPermissionsOverride,
  REWARD_REFERRER_OVERRIDE,
} from '../../../utils/permissions-overrides'

const override = getPermissionsOverride(REWARD_REFERRER_OVERRIDE)
jest.mock('../../databaseClient')
jest.mock('../addVc')
jest.mock('../addUsersRecruited')

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})

const timeBeforeEmailVerifyFeatureChange = '2018-09-14T02:10:13.000Z'
const timeAfterEmailVerifyFeatureChange = '2018-09-28T08:00:30.000Z'

describe('rewardReferringUser', () => {
  it('gives the referring user VC as expected', async () => {
    expect.assertions(3)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    await rewardReferringUser(userContext, userId)
    const addVcCallParams = addVc.mock.calls[0]
    expect(addVcCallParams[0]).toMatch(
      /REWARD_REFERRER_OVERRIDE_CONFIRMED_[0-9]{5}$/
    )
    expect(addVcCallParams[1]).toBe(referringUserId)
    expect(addVcCallParams[2]).toBe(350)
  })

  it("calls to increment the referring user's number of recruited users", async () => {
    expect.assertions(2)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    await rewardReferringUser(userContext, userId)
    expect(addUsersRecruited).toHaveBeenCalledWith(referringUserId, 1)
    expect(addUsersRecruited).toHaveBeenCalledTimes(1)
  })

  it('returns true when the referrer was rewarded', async () => {
    expect.assertions(1)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    const response = await rewardReferringUser(userContext, userId)
    expect(response).toBe(true)
  })

  it('does not reward a referrer if no referral data exists', async () => {
    expect.assertions(3)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: null, // no referral data exists
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    const response = await rewardReferringUser(userContext, userId)
    expect(response).toBe(false)
    expect(addVc).not.toHaveBeenCalled()
    expect(addUsersRecruited).not.toHaveBeenCalled()
  })

  it('does not reward a referrer if the referral data does not include a user referrer', async () => {
    expect.assertions(3)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: null, // no referring user
          referringChannel: 'some-channel',
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    const response = await rewardReferringUser(userContext, userId)
    expect(response).toBe(false)
    expect(addVc).not.toHaveBeenCalled()
    expect(addUsersRecruited).not.toHaveBeenCalled()
  })

  it('does not reward a referrer if the referrer was already rewarded', async () => {
    expect.assertions(3)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      // Note that the referrer was already rewarded.
      Item: Object.assign({}, mockUser, {
        referrerRewarded: true,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    const response = await rewardReferringUser(userContext, userId)
    expect(response).toBe(false)
    expect(addVc).not.toHaveBeenCalled()
    expect(addUsersRecruited).not.toHaveBeenCalled()
  })

  it('does not reward a referrer if the referred user joined before we changed the email verification feature', async () => {
    expect.assertions(1)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeBeforeEmailVerifyFeatureChange, // before feature change
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    const response = await rewardReferringUser(userContext, userId)
    expect(response).toBe(false)
  })

  it('does not reward a referrer if the referred user does not have a "joined" time (which should never happen)', async () => {
    expect.assertions(1)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: undefined, // missing datetime
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    const response = await rewardReferringUser(userContext, userId)
    expect(response).toBe(false)
  })

  it('throws if there is an error when getting the referral data', async () => {
    expect.assertions(1)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))

    // Mock getting the ReferralData.
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new Error({ code: 'SomeFakeError' }) // simple mock error
    )

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    await expect(rewardReferringUser(userContext, userId)).rejects.toThrow()
  })

  it('throws if there is an error when getting the user', async () => {
    expect.assertions(1)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new Error({ code: 'SomeFakeError' }) // simple mock error
    )

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    await expect(rewardReferringUser(userContext, userId)).rejects.toThrow()
  })

  it('throws if there is an error when updating the user to mark its referrer as rewarded', async () => {
    expect.assertions(1)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      null,
      new Error({ code: 'SomeFakeError' }) // simple mock error
    )
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    // FIXME
    await expect(rewardReferringUser(userContext, userId)).rejects.toThrow()
  })

  it('throws if there is an error when rewarding the user with VC', async () => {
    expect.assertions(1)
    // console.log('====================')

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    // Mock an error when adding VC.
    addVc.mockImplementationOnce(() => Promise.reject(new Error('Darn.')))

    await expect(rewardReferringUser(userContext, userId)).rejects.toThrow(
      'Darn.'
    )
  })

  it("throws if there is an error when increasing the referrer's count of referred users", async () => {
    expect.assertions(1)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new DatabaseItemDoesNotExistException() // simple mock error
    )
    // Mock an error when adding VC.
    addUsersRecruited.mockImplementationOnce(() =>
      Promise.reject(new Error('Whoops.'))
    )

    await expect(rewardReferringUser(userContext, userId)).rejects.toThrow(
      'Whoops.'
    )
  })

  it.only('gives both the referring user and referred user User Impact as expected', async () => {
    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning a record for referring user Impact
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        ...getMockUserImpact(),
        pendingUserReferralImpact: 5,
        pendingUserReferralCount: 1,
      },
    })
    // Mock returning a record for referred user Impact
    const userImpact = {
      ...getMockUserImpact(),
      userId,
      pendingUserReferralImpact: 0,
      pendingUserReferralCount: 0,
    }
    const userImpactReturnedFromCreate = getMockUserImpactInstance(
      Object.assign({}, userImpact)
    )
    console.log(userImpactReturnedFromCreate, 'returned from create')
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: userImpactReturnedFromCreate,
    })
    // Mock updating referring user impact
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Item: {
        ...getMockUserImpact(),
      },
    })
    // Mock updating referred user impact
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Item: {
        ...getMockUserImpact(),
        userId,
      },
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await rewardReferringUser(userContext, userId)
    expect(updateMethod).toHaveBeenNthCalledWith(1, override, {
      ...getMockUserImpact(),
      pendingUserReferralCount: 2,
      pendingUserReferralImpact: 10,
    })
    expect(updateMethod).toHaveBeenNthCalledWith(2, override, {
      ...getMockUserImpact(),
      pendingUserReferralCount: 0,
      pendingUserReferralImpact: 5,
    })
  })

  it('throws if there is an error when increasing user impact', async () => {
    expect.assertions(1)

    const userContext = getMockUserContext()
    const userInfo = getMockUserInfo()
    const userId = userInfo.id
    const mockUser = getMockUserInstance(Object.assign({}, userInfo))
    const referringUserId = 'referring-user-id-123'

    // Mock getting the ReferralData.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign(
        {},
        new ReferralDataModel({
          userId,
          referringUser: referringUserId,
          referringChannel: null,
        })
      ),
    })

    // Mock getting the user to check if its referral has been rewarded.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: Object.assign({}, mockUser, {
        referrerRewarded: false,
        joined: timeAfterEmailVerifyFeatureChange,
      }),
    })

    // Mock updating the user to mark the user as referred.
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: Object.assign({}, mockUser, { referrerRewarded: true }),
    })
    // Mock returning no record for user Impact
    setMockDBResponse(
      DatabaseOperation.GET,
      null,
      new Error('Whoops.') // simple mock error
    )
    // Mock an error when adding VC.
    await expect(rewardReferringUser(userContext, userId)).rejects.toThrow(
      'Whoops.'
    )
  })
})
