import Joi from '@hapi/joi'
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
// https://hapi.dev/module/joi/api/?v=17.1.1#anyextractpath
const configFields = Joi.object({
  content: Joi.object({
    titleMarkdown: Joi.string().required(),
    descriptionMarkdown: Joi.string().required(),
  }),
  goal: Joi.object({
    impactUnitSingular: Joi.string().required(),
    impactUnitPlural: Joi.string().required(),
    impactVerbPastParticiple: Joi.string().required(),
    impactVerbPastTense: Joi.string().required(),
    limitProgressToTargetMax: Joi.boolean().required(),
    numberSource: Joi.any()
      .valid(HEARTS, MONEY_RAISED, NEW_USERS, TABS_OPENED)
      .required(),
    showProgressBarLabel: Joi.boolean().required(),
    showProgressBarEndText: Joi.boolean().required(),
    targetNumber: Joi.number().required(),
    transformNumberSourceValue: Joi.function(), // optional
  }),
  showCountdownTimer: Joi.boolean(),
  showHeartsDonationButton: Joi.boolean(),
  showProgressBar: Joi.boolean(),
  showSocialSharing: Joi.boolean(),
  socialSharing: Joi.object({
    url: Joi.string().required(),
    EmailShareButtonProps: Joi.object({
      subject: Joi.string().required(),
      body: Joi.string().required(),
    }),
    FacebookShareButtonProps: Joi.object({
      quote: Joi.string().required(),
    }),
    RedditShareButtonProps: Joi.object({
      title: Joi.string().required(),
    }),
    TumblrShareButtonProps: Joi.object({
      title: Joi.string().required(),
      caption: Joi.string().required(),
    }),
    TwitterShareButtonProps: Joi.object({
      title: Joi.string().required(),
      related: Joi.array(),
    }),
  }),
  theme: Joi.object({
    color: Joi.object({
      main: Joi.string().required(),
      light: Joi.string().required(),
    }),
  }),
})

const campaignConfigInputSchema = Joi.object({
  campaignId: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  // The "charityId" value is required when there is a hearts donation
  // button.
  charityId: Joi.any()
    .when('showHeartsDonationButton', {
      is: Joi.valid(true).required(),
      then: Joi.string()
        .guid()
        .required(),
      otherwise: Joi.string(),
    })
    .when('onEnd.showHeartsDonationButton', {
      is: Joi.valid(true).required(),
      then: Joi.string()
        .guid()
        .required(),
      otherwise: Joi.string(),
    }),
  content: configFields.extract('content').required(),
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
  goal: configFields.extract('goal').when('showProgressBar', {
    is: Joi.valid(true).required(),
    then: Joi.required(),
    otherwise: Joi.when(Joi.ref('/onEnd.showProgressBar'), {
      is: Joi.valid(true).required(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }),
  // The "onEnd" value is required when "endTriggers" is defined;
  // otherwise, "onEnd" is not allowed.
  onEnd: Joi.object({
    // The "onEnd.content" value will completely replace the
    // "content" value. It is not merged.
    content: configFields.extract('content').optional(),
    // The "onEnd.goal" is only allowed if "goal" is defined.
    goal: configFields
      .extract('goal')
      .concat(
        Joi.object({
          // Fields are optional because this will be merged with the
          // top-level goal object. Some fields are forbidden because
          // they cannot be changed on campaign end.
          impactUnitSingular: Joi.optional(),
          impactUnitPlural: Joi.optional(),
          impactVerbPastParticiple: Joi.optional(),
          impactVerbPastTense: Joi.optional(),
          limitProgressToTargetMax: Joi.optional(),
          numberSource: Joi.forbidden(),
          showProgressBarLabel: Joi.optional(),
          showProgressBarEndText: Joi.optional(),
          targetNumber: Joi.forbidden(),
          transformNumberSourceValue: Joi.forbidden(),
        })
      )
      .when(Joi.ref('/goal'), {
        is: Joi.required(),
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
      }),
    showCountdownTimer: configFields.extract('showCountdownTimer').optional(),
    showHeartsDonationButton: configFields
      .extract('showHeartsDonationButton')
      .optional(),
    showProgressBar: configFields.extract('showProgressBar').optional(),
    showSocialSharing: configFields.extract('showSocialSharing').optional(),
    // The "onEnd.socialSharing" field is required when
    // "onEnd.showSocialSharing" is true. This value will completely
    // replace teh "socailSharing" value. It is not merged.
    socialSharing: configFields
      .extract('socialSharing')
      .when('showSocialSharing', {
        is: Joi.valid(true).required(),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
    // The "onEnd.theme" value will completely replace the
    // "theme" value. It is not merged.
    theme: configFields.extract('theme').optional(),
  }),
  showCountdownTimer: configFields.extract('showCountdownTimer').required(),
  showHeartsDonationButton: configFields
    .extract('showHeartsDonationButton')
    .required(),
  showProgressBar: configFields.extract('showProgressBar').required(),
  showSocialSharing: configFields.extract('showSocialSharing').required(),
  // The "socialSharing" field is required when "showSocialSharing"
  // is true.
  socialSharing: configFields
    .extract('socialSharing')
    .when('showSocialSharing', {
      is: Joi.valid(true).required(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  theme: configFields.extract('theme').optional(),
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
    endTriggers,
    goal,
    onEnd,
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
      // (e.g., "given", "donated", "raised")
      impactVerbPastParticiple,
      // The verb we use to describe what we're doing with the impact units
      // (e.g., "gave", "donated", "raised")
      impactVerbPastTense,
      // If true, the client should not display a currentNumber greater than
      // the targetNumber. Instead, limit goal progress to 100% of the target.
      limitProgressToTargetMax,
      // The internal source we are using to calculate the number of impact
      // units. One of: "hearts", "newUsers", "moneyRaised", "tabsOpened"
      numberSource,
      showProgressBarLabel,
      showProgressBarEndText,
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
      impactVerbPastParticiple,
      impactVerbPastTense,
      showProgressBarLabel,
      showProgressBarEndText,
    }
  }

  const isCampaignLive = () =>
    process.env.IS_GLOBAL_CAMPAIGN_LIVE === 'true' || false

  return {
    addMoneyRaised: async USDMoneyRaisedToAdd => {
      // If not counting money raised or the campaign is not active, ignore this.
      if (!(countMoneyRaised && isCampaignLive())) {
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
    ...(configuredGoal && {
      goal: configuredGoal,
    }),
    endTriggers,
    incrementNewUserCount: async () => {
      // If not counting new users or the campaign is not active, ignore this.
      if (!(countNewUsers && isCampaignLive())) {
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
      if (!(countTabsOpened && isCampaignLive())) {
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
    get isLive() {
      return isCampaignLive()
    },
    onEnd,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    theme,
    time,
  }
}

export default createCampaignConfiguration
