import Joi from '@hapi/joi'
import moment from 'moment'
import { isNil } from 'lodash/lang'
import callRedis from '../../utils/redis'
import CharityModel from '../charities/CharityModel'
import getCharityVcReceived from '../donations/getCharityVcReceived'

const HEARTS = 'hearts'
const MONEY_RAISED = 'moneyRaised'
const NEW_USERS = 'newUsers'
const TABS_OPENED = 'tabsOpened'

// Campaign config input fields that the user can modify
// on campaign end. This serves as shared schema between
// the top-level config input and the "onEnd" ojbect.
const configFields = {
  content: Joi.object({
    titleMarkdown: Joi.string().required(),
    descriptionMarkdown: Joi.string().required(),
  }),
  goal: Joi.object({
    impactUnitSingular: Joi.string().required(),
    impactUnitPlural: Joi.string().required(),
    impactVerbPastTense: Joi.string().required(),
    limitProgressToTargetMax: Joi.boolean().required(),
    numberSource: Joi.any()
      .valid(HEARTS, MONEY_RAISED, NEW_USERS, TABS_OPENED)
      .required(),
    targetNumber: Joi.number().required(),
    transformNumberSourceValue: Joi.function(), // optional
  }),
  showCountdownTimer: Joi.boolean(),
  showHeartsDonationButton: Joi.boolean(),
  showProgressBar: Joi.boolean(),
  theme: Joi.object({
    color: Joi.object({
      main: Joi.string().required(),
      light: Joi.string().required(),
    }),
  }),
}

const campaignConfigInputSchema = Joi.object({
  campaignId: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  // The "charityId" value is required when there is a hearts donation button.
  charityId: Joi.any().when('showHeartsDonationButton', {
    is: Joi.valid(true),
    then: Joi.string()
      .guid()
      .required(),
    otherwise: Joi.string().allow(null),
  }),
  content: configFields.content.required(),
  countNewUsers: Joi.boolean(),
  countMoneyRaised: Joi.boolean(),
  countTabsOpened: Joi.boolean(),
  // The "endTriggers" value is required when "onEnd" is defined
  // and is otherwise not allowed.
  endTriggers: Joi.object({
    whenGoalAchieved: Joi.boolean(),
    whenTimeEnds: Joi.boolean(),
  }),
  // The "goal" value is required when there is a progress bar.
  goal: configFields.goal.when('showProgressBar', {
    is: Joi.valid(true),
    then: Joi.required(),
    otherwise: Joi.allow(null),
  }),
  // The "onEnd" value is required when "endTriggers" is defined
  // and is otherwise not allowed.
  onEnd: Joi.object({
    content: configFields.content,
    goal: configFields.goal,
    showCountdownTimer: configFields.showCountdownTimer,
    showHeartsDonationButton: configFields.showHeartsDonationButton,
    showProgressBar: configFields.showProgressBar,
    theme: configFields.theme,
  }),
  showCountdownTimer: configFields.showCountdownTimer.required(),
  showHeartsDonationButton: configFields.showHeartsDonationButton.required(),
  showProgressBar: configFields.showProgressBar.required(),
  theme: configFields.theme,
  time: Joi.object({
    start: Joi.date()
      .iso()
      .required(),
    end: Joi.date()
      .iso()
      .required(),
  }).required(),
})
  .and('endTriggers', 'onEnd')
  .prefs({ convert: true }) // cast values if possible

const WrongCampaignConfigError = message => {
  return new Error(`Campaign config validation error: ${message}`)
}

const createCampaignConfiguration = input => {
  try {
    Joi.assert(input, campaignConfigInputSchema)
  } catch (e) {
    throw new WrongCampaignConfigError(e.details[0].message)
  }

  const {
    campaignId,
    charityId = null,
    countMoneyRaised = false,
    countNewUsers = false,
    countTabsOpened = false,
    content,
    endContent,
    goal,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    theme,
    time,
  } = input

  const redisKeyNewUsers = `campaign:${campaignId}:newUsers`
  const redisKeyMoneyRaised = `campaign:${campaignId}:moneyRaised`
  const redisKeyTabsOpened = `campaign:${campaignId}:tabsOpened`

  const getVCDonated = async userContext => {
    try {
      const vcDonated = await getCharityVcReceived(
        userContext,
        charityId,
        time.start,
        time.end
      )
      return vcDonated
    } catch (e) {
      throw e
    }
  }

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

  // Get an estimate of money raised for this campaign.
  const getEstimatedMoneyRaised = async () => {
    let estUSDMoneyRaised = 0
    try {
      const nanoUSDMoneyRaised = await callRedis({
        operation: 'GET',
        key: redisKeyMoneyRaised,
      })
      // Redis doesn't support large float precision, so we store
      // revenue as an integer.
      estUSDMoneyRaised = nanoUSDMoneyRaised * 1e-9

      if (!estUSDMoneyRaised) {
        estUSDMoneyRaised = 0
      }
    } catch (e) {
      // Redis will log errors.
    }
    return estUSDMoneyRaised
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
      // The singular name of the things the goal is tracking (e.g. "new user",
      // "heart", "meal")
      impactUnitSingular,
      // The plural name of the things the goal is tracking (e.g. "new users",
      // "hearts", "meals")
      impactUnitPlural,
      // The verb we use to describe what we're doing with the impact units
      // (e.g., "recruited", "donated", "raised")
      impactVerbPastTense,
      // If true, the client should not display a currentNumber greater than
      // the targetNumber. Instead, limit goal progress to 100% of the target.
      limitProgressToTargetMax,
      // The internal source we are using to calculate the number of impact
      // units. One of: "hearts", "newUsers", "moneyRaised", "tabsOpened"
      numberSource,
      // The target number of impact units this campaign could raise
      targetNumber,
      /**
       * An optional function to modify the value of the "numberSource" before
       * using it as the current number value. For example, we can use this to
       * change the estimated money raised into a measure of "meals given" by
       * multiplying the money raised by the cost per meal.
       * @param {Number} val – the current value from the "numberSource"; e.g.,
       *   the estimated money raised for this campaign.
       * @return {Number} The transformed number
       */
      transformNumberSourceValue,
    } = goal

    configuredGoal = {
      targetNumber,
      getCurrentNumber: async userContext => {
        let currentNumber = 0
        switch (numberSource) {
          case HEARTS: {
            currentNumber = await getVCDonated(userContext)
            break
          }
          case MONEY_RAISED: {
            currentNumber = await getEstimatedMoneyRaised()
            break
          }
          case NEW_USERS: {
            currentNumber = await getNewUserCount()
            break
          }
          case TABS_OPENED: {
            currentNumber = await getTabCount()
            break
          }
          default: {
            throw new Error(`The "goal.numberSource" is invalid.`)
          }
        }

        // If a number transform function was provided, calculate
        // the transformed value.
        if (transformNumberSourceValue) {
          currentNumber = transformNumberSourceValue(currentNumber)
        }

        return currentNumber
      },
      limitProgressToTargetMax,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
    }
  }

  return {
    addMoneyRaised: async USDMoneyRaisedToAdd => {
      // If not counting money raised or the campaign is not active, ignore this.
      if (!(countMoneyRaised && isActive())) {
        return
      }

      // Redis doesn't support large float precision, so we store
      // revenue as an integer.
      const nanoUSDMoneyRaised = Math.round(USDMoneyRaisedToAdd * 1e9)

      try {
        await callRedis({
          operation: 'INCRBY',
          key: redisKeyMoneyRaised,
          amountToAdd: nanoUSDMoneyRaised,
        })
      } catch (e) {
        // Redis will log errors.
      }
    },
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
    theme,
    time,
  }
}

export default createCampaignConfiguration
