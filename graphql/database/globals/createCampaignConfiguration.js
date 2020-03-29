import moment from 'moment'
import { isNil, isNumber, isString } from 'lodash/lang'
import callRedis from '../../utils/redis'
import CharityModel from '../charities/CharityModel'

const WrongCampaignConfigError = (field, expectedType) => {
  return new Error(
    `The campaign config requires the field "${field}" to be type "${expectedType}".`
  )
}

const createCampaignConfiguration = input => {
  const {
    campaignId,
    charityId = null,
    countNewUsers = false,
    countTabsOpened = false,
    content,
    endContent,
    goal,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    time,
  } = input

  // Makes sure the campaignId is set.
  if (isNil(campaignId) || !isString(campaignId)) {
    throw WrongCampaignConfigError('campaignId', 'string')
  }

  // Make sure the "content" value is set properly.
  if (isNil(content)) {
    throw WrongCampaignConfigError('content', 'object')
  }
  if (isNil(content.titleMarkdown)) {
    throw WrongCampaignConfigError('content.titleMarkdown', 'string')
  }
  if (isNil(content.descriptionMarkdown)) {
    throw WrongCampaignConfigError('content.descriptionMarkdown', 'string')
  }

  // Make sure "endContent" is set properly if it's defined.
  if (!isNil(endContent)) {
    if (isNil(endContent.titleMarkdown)) {
      throw WrongCampaignConfigError('endContent.titleMarkdown', 'string')
    }
    if (isNil(endContent.descriptionMarkdown)) {
      throw WrongCampaignConfigError('endContent.descriptionMarkdown', 'string')
    }
  }

  // If the "charityId" is set, make sure it's a string.
  if (!isNil(charityId)) {
    if (!isString(charityId)) {
      throw WrongCampaignConfigError('charityId', 'string')
    }
  }

  const redisKeyNewUsers = `campaign:${campaignId}:newUsers`
  const redisKeyTabsOpened = `campaign:${campaignId}:tabsOpened`

  // Try to get the count of tabs opened during this campaign.
  // Default to zero if the item doesn't exist or fails to
  // fetch.
  const getTabCount = async () => {
    let count = 0
    try {
      count = await callRedis({
        operation: 'GET',
        key: redisKeyTabsOpened,
      })
      if (!count) {
        count = 0
      }
    } catch (e) {
      // Redis will log errors.
    }
    return count
  }

  // Try to get the number of new users during this campaign.
  // Default to zero if the item doesn't exist or fails to
  // fetch.
  const getNewUserCount = async () => {
    let count = 0
    try {
      count = await callRedis({
        operation: 'GET',
        key: redisKeyNewUsers,
      })
      if (!count) {
        count = 0
      }
    } catch (e) {
      // Redis will log errors.
    }
    return count
  }

  /**
   * Return whether the current time is between the campaign's start and
   * end times.
   * @return {Boolean}
   */
  const isActive = () => {
    const timeInfo = time
    return moment().isAfter(timeInfo.start) && moment().isBefore(timeInfo.end)
  }

  let configuredGoal = null
  if (!isNil(goal)) {
    const {
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
      targetNumber,
    } = goal
    if (!isNumber(targetNumber)) {
      throw WrongCampaignConfigError('goal.targetNumber', 'number')
    }

    // TODO: more validation
    configuredGoal = {
      targetNumber,
      // currentNumber // set this when getting the campaign data
      // TODO: base this on other inputs about how to calculate impact
      getCurrentNumber: async () => {
        // E.g.: if relying on tabs, calculate current number from
        // tab count.
        // if (something) {}
        await getTabCount()
        // If relying on new users, caculate current number from
        // the new user count
        // else if (something) {}
        await getNewUserCount()
        // else throw
        return 12.42e6
      },
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
    }
  }

  return {
    campaignId,
    getCharityData: async userContext => {
      if (!charityId) {
        return null
      }
      try {
        const charity = await CharityModel.get(userContext, charityId)
        return charity
      } catch (e) {
        throw e
      }
    },
    content,
    ...(endContent && { endContent }),
    ...(configuredGoal && {
      goal: configuredGoal,
    }),
    incrementNewUserCount: async () => {
      // If not counting new users or the campaign is not active, ignore this.
      if (!(countNewUsers && isActive())) {
        return
      }
      try {
        await callRedis({
          operation: 'INCR',
          key: redisKeyNewUsers,
        })
      } catch (e) {
        // Redis will log errors.
      }
    },
    incrementTabCount: async () => {
      // If not counting tabs or the campaign is not active, ignore this.
      if (!(countTabsOpened && isActive())) {
        return
      }
      try {
        await callRedis({
          operation: 'INCR',
          key: redisKeyTabsOpened,
        })
      } catch (e) {
        // Redis will log errors.
      }
    },
    isActive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    time,
  }
}

export default createCampaignConfiguration
