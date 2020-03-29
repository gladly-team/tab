/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'
import createCampaignConfiguration from '../createCampaignConfiguration'
import callRedis from '../../../utils/redis'
import CharityModel from '../../charities/CharityModel'
import { getMockUserContext } from '../../test-utils'

jest.mock('../../../utils/redis')
jest.mock('../../charities/CharityModel')
jest.mock('../../../utils/logger')

const mockNow = '2020-05-02T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
  CharityModel.get.mockReturnValue(null)
})

// Get an example of campaign config input.
const getMockCampaignConfigInput = () => ({
  campaignId: 'myCoolCampaign',
  charityId: '5ae19457-a8a7-4c28-89ee-52179a2fb966',
  content: {
    titleMarkdown: '## Some title',
    descriptionMarkdown: '#### A description goes here.',
  },
  countNewUsers: true,
  countTabsOpened: true,
  endContent: {
    titleMarkdown: '## Another title',
    descriptionMarkdown: '#### Another description goes here.',
  },
  goal: {
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastTense: 'raised',
    numberSource: 'hearts',
    targetNumber: 10e6,
    transformNumberSourceValue: undefined, // optional function
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  time: {
    start: '2020-05-01T18:00:00.000Z',
    end: '2020-05-05T18:00:00.000Z',
  },
})

describe('createCampaignConfiguration', () => {
  it('returns an object with the expected required properties', () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(createCampaignConfiguration(mockCampaignInput)).toEqual({
      campaignId: 'myCoolCampaign',
      content: {
        titleMarkdown: '## Some title',
        descriptionMarkdown: '#### A description goes here.',
      },
      endContent: {
        titleMarkdown: '## Another title',
        descriptionMarkdown: '#### Another description goes here.',
      },
      getCharityData: expect.any(Function),
      goal: {
        getCurrentNumber: expect.any(Function),
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastTense: 'raised',
        targetNumber: 10e6,
      },
      incrementNewUserCount: expect.any(Function),
      incrementTabCount: expect.any(Function),
      isActive: expect.any(Function),
      showCountdownTimer: true,
      showHeartsDonationButton: true,
      showProgressBar: true,
      time: {
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z',
      },
    })
  })

  it('calls Redis as expected when calling incrementNewUserCount and countNewUsers is true', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: true,
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCR',
      key: 'campaign:myFunCampaign:newUsers',
    })
  })

  it('does not call Redis when calling incrementNewUserCount and countNewUsers is false', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: false,
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling incrementNewUserCount and countNewUsers is undefined (it defaults to false)', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: undefined,
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling incrementNewUserCount and the campaign is no longer active', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-04-21T18:00:00.000Z',
        end: '2020-04-28T18:00:00.000Z', // campaign has ended
      },
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('calls Redis as expected when calling incrementTabCount and countTabsOpened is true', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCR',
      key: 'campaign:myFunCampaign:tabsOpened',
    })
  })

  it('does not call Redis when calling incrementTabCount and countTabsOpened is false', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: false,
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling incrementTabCount and countTabsOpened is undefined (it defaults to false)', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: undefined,
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling incrementTabCount and the campaign is no longer active', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-04-21T18:00:00.000Z',
        end: '2020-04-28T18:00:00.000Z', // campaign has ended
      },
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('fetches the charity as expected when calling getCharityData', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'some-charity-id',
    })
    const mockUserContext = getMockUserContext()
    await campaignConfig.getCharityData(mockUserContext)
    expect(CharityModel.get).toHaveBeenCalledWith(
      mockUserContext,
      'some-charity-id'
    )
  })

  it('returns the expected charity data when calling getCharityData', async () => {
    expect.assertions(1)
    CharityModel.get.mockReturnValue({
      id: 'some-charity-id',
      foo: 'bar',
    })
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'some-charity-id',
    })
    const mockUserContext = getMockUserContext()
    const charityData = await campaignConfig.getCharityData(mockUserContext)
    expect(charityData).toEqual({
      id: 'some-charity-id',
      foo: 'bar',
    })
  })

  it('returns null charity data when no charityId is defined in the config', async () => {
    expect.assertions(1)
    CharityModel.get.mockReturnValue({
      id: 'some-charity-id',
      foo: 'bar',
    })
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      showHeartsDonationButton: false, // required when charityId is null
      charityId: null, // no charity ID defined
    })
    const mockUserContext = getMockUserContext()
    const charityData = await campaignConfig.getCharityData(mockUserContext)
    expect(charityData).toBeNull()
  })

  it('throws if fetching the charity thows', async () => {
    expect.assertions(1)
    const mockErr = new Error('The database has failed us.')
    CharityModel.get.mockImplementation(() => {
      throw mockErr
    })
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'some-charity-id',
    })
    const mockUserContext = getMockUserContext()
    await expect(
      campaignConfig.getCharityData(mockUserContext)
    ).rejects.toEqual(mockErr)
  })

  it('isActive() returns true if the campaign is still active', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z', // campaign is still active
      },
    })
    expect(campaignConfig.isActive()).toBe(true)
  })

  it('isActive() returns false if the campaign is no longer active', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-04-21T18:00:00.000Z',
        end: '2020-04-28T18:00:00.000Z', // campaign has ended
      },
    })
    expect(campaignConfig.isActive()).toBe(false)
  })

  it('throws if "campaignId" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        campaignId: undefined,
      })
    }).toThrow(
      'The campaign config requires the field "campaignId" to be type "string".'
    )
  })

  it('throws if "campaignId" is not a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        campaignId: 1234,
      })
    }).toThrow(
      'The campaign config requires the field "campaignId" to be type "string".'
    )
  })

  it('does not throw if "charityId" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showHeartsDonationButton: false, // required when charityId is null
        charityId: undefined,
      })
    }).not.toThrow()
  })

  it('throws if "charityId" is set to something other than a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        charityId: 1234,
      })
    }).toThrow(
      'The campaign config requires the field "charityId" to be type "string".'
    )
  })

  it('throws if "content" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        content: undefined,
      })
    }).toThrow(
      'The campaign config requires the field "content" to be type "object".'
    )
  })

  it('throws if "content.titleMarkdown" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        content: {
          titleMarkdown: undefined,
          descriptionMarkdown: '#### Something',
        },
      })
    }).toThrow(
      'The campaign config requires the field "content.titleMarkdown" to be type "string".'
    )
  })

  it('throws if "content.descriptionMarkdown" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        content: {
          titleMarkdown: '## A title',
          descriptionMarkdown: undefined,
        },
      })
    }).toThrow(
      'The campaign config requires the field "content.descriptionMarkdown" to be type "string".'
    )
  })

  it('does not throw if "endContent" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endContent: undefined,
      })
    }).not.toThrow()
  })

  it('throws if "endContent.titleMarkdown" is not defined when endContent is set', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endContent: {
          titleMarkdown: undefined,
          descriptionMarkdown: '#### Something',
        },
      })
    }).toThrow(
      'The campaign config requires the field "endContent.titleMarkdown" to be type "string".'
    )
  })

  it('throws if "endContent.descriptionMarkdown" is not defined when endContent is set', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endContent: {
          titleMarkdown: '## A title',
          descriptionMarkdown: undefined,
        },
      })
    }).toThrow(
      'The campaign config requires the field "endContent.descriptionMarkdown" to be type "string".'
    )
  })

  it('throws if "showCountdownTimer" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showCountdownTimer: undefined,
      })
    }).toThrow(
      'The campaign config requires the field "showCountdownTimer" to be type "boolean".'
    )
  })

  it('throws if "showCountdownTimer" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showCountdownTimer: 0,
      })
    }).toThrow(
      'The campaign config requires the field "showCountdownTimer" to be type "boolean".'
    )
  })

  it('throws if "showHeartsDonationButton" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showHeartsDonationButton: undefined,
      })
    }).toThrow(
      'The campaign config requires the field "showHeartsDonationButton" to be type "boolean".'
    )
  })

  it('throws if "showHeartsDonationButton" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showHeartsDonationButton: 0,
      })
    }).toThrow(
      'The campaign config requires the field "showHeartsDonationButton" to be type "boolean".'
    )
  })

  it('throws if "showProgressBar" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showProgressBar: undefined,
      })
    }).toThrow(
      'The campaign config requires the field "showProgressBar" to be type "boolean".'
    )
  })

  it('throws if "showProgressBar" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showProgressBar: 0,
      })
    }).toThrow(
      'The campaign config requires the field "showProgressBar" to be type "boolean".'
    )
  })

  it('throws if "time" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: undefined,
      })
    }).toThrow(
      'The campaign config requires the field "time" to be type "object".'
    )
  })

  it('throws if "time.start" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: {
          start: undefined,
          end: '2020-05-01T18:00:00.000Z',
        },
      })
    }).toThrow(
      'The campaign config requires the field "time.start" to be type "string".'
    )
  })

  it('throws if "time.start" is not a valid ISO timestamp', async () => {
    expect.assertions(1)

    // Suppress expected moment.js complaint.
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: {
          start: '2018-12-23 10am', // invalid
          end: '2020-05-01T18:00:00.000Z',
        },
      })
    }).toThrow('The "time.start" value must be a valid ISO timestamp.')
  })

  it('throws if "time.end" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: {
          start: '2020-05-01T18:00:00.000Z',
          end: undefined,
        },
      })
    }).toThrow(
      'The campaign config requires the field "time.end" to be type "string".'
    )
  })

  it('throws if "time.end" is not a valid ISO timestamp', async () => {
    expect.assertions(1)

    // Suppress expected moment.js complaint.
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: {
          start: '2020-05-01T18:00:00.000Z',
          end: '2018-12-23 10am', // invalid
        },
      })
    }).toThrow('The "time.end" value must be a valid ISO timestamp.')
  })

  it('throws if "showHeartsDonationButton" is true but "charityId" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        charityId: undefined,
        showHeartsDonationButton: true,
      })
    }).toThrow(
      'The campaign config requires a configured "charityId" when "showHeartsDonationButton" is set to true.'
    )
  })

  it('throws if "showProgressBar" is true but "goal" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: undefined,
        showProgressBar: true,
      })
    }).toThrow(
      'The campaign config requires a configured "goal" when "showProgressBar" is set to true.'
    )
  })

  it('does not throw if "goal" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: undefined,
        showProgressBar: false, // required if a goal is not defined
      })
    }).not.toThrow()
  })

  it('throws if "goal.impactUnitSingular" is not a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          impactUnitSingular: undefined,
        },
      })
    }).toThrow(
      'The campaign config requires the field "goal.impactUnitSingular" to be type "string".'
    )
  })

  it('throws if "goal.impactUnitPlural" is not a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          impactUnitPlural: undefined,
        },
      })
    }).toThrow(
      'The campaign config requires the field "goal.impactUnitPlural" to be type "string".'
    )
  })

  it('throws if "goal.impactVerbPastTense" is not a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          impactVerbPastTense: undefined,
        },
      })
    }).toThrow(
      'The campaign config requires the field "goal.impactVerbPastTense" to be type "string".'
    )
  })

  it('throws if "goal.targetNumber" is not a number', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          targetNumber: '100',
        },
      })
    }).toThrow(
      'The campaign config requires the field "goal.targetNumber" to be type "number".'
    )
  })

  it('does not throw if "goal.numberSource" is "hearts"', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'hearts',
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "goal.numberSource" is "moneyRaised"', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'moneyRaised',
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "goal.numberSource" is "newUsers"', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'newUsers',
        },
      })
    }).not.toThrow()
  })

  it('throws if "goal.numberSource" is not one of the valid strings', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'pizza',
        },
      })
    }).toThrow(
      'The "goal.numberSource" value must be one of: hearts, moneyRaised, newUsers'
    )
  })

  it('throws if "goal.transformNumberSourceValue" is defined but is not a function', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          transformNumberSourceValue: 0.12,
        },
      })
    }).toThrow(
      'The campaign config requires the field "goal.transformNumberSourceValue" to be type "function".'
    )
  })
})
