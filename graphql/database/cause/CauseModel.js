import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { CAUSE } from '../constants'

/*
 * @extends BaseModel
 */
class Cause extends BaseModel {
  static get name() {
    return CAUSE
  }

  static get hashKey() {
    return 'id'
  }

  static get tableName() {
    return tableNames.causes
  }

  static get schema() {
    return {
      // TODO: additional restrictions, e.g. for nanoid
      id: types
        .string()
        .required()
        .description(`The ID for the cause.`),
      charityId: types
        .string()
        .required()
        .description(
          `Charity that this cause is currently generating impact for`
        ),
      landingPagePath: types
        .string()
        .required()
        .description(`URL path for the landing page belonging to this cause`),
      impactVisits: types
        .number()
        .integer()
        .required()
        .description(
          `number of visits required for each impact unit (e.g. 14 for cat charity)`
        ),
      impact: types.object({
        impactCounterText: types
          .string()
          .required()
          .description(
            `markdown string: copy for ImpactCounter dropdown for normal case`
          ),
        referralRewardTitle: types
          .string()
          .required()
          .description(
            `markdown string: title copy for referralReward UserImpact modal`
          ),
        referralRewardSubtitle: types
          .string()
          .required()
          .description(
            `markdown string: subtitle copy for referralReward UserImpact modal`
          ),
        referralRewardNotification: types
          .string()
          .required()
          .description(
            `markdown string: copy for referral reward notification`
          ),
        claimImpactSubtitle: types
          .string()
          .required()
          .description(
            `markdown string: title for claimImpact notification in UserImpact`
          ),
        impactIcon: types
          .string()
          .required()
          .description(`string: name of the icon to use in impact counter`),
        walkMeGif: types
          .string()
          .required()
          .description(`string: file name of the gif to use in walk me`),
        impactWalkthroughText: types
          .string()
          .required()
          .description(
            `markdown string: copy for impact walkthrough notification in UserImpact`
          ),
        newlyReferredImpactWalkthroughText: types
          .string()
          .required()
          .description(
            `markdown string: copy for impact walkthrough notification in UserImpact when user is referred`
          ),
        confirmImpactSubtitle: types
          .string()
          .required()
          .description(
            `markdown string: copy for confirm impact modal in UserImpact`
          ),
      }),
      theme: types.object({
        primaryColor: types
          .string()
          .required()
          .description(`the primary color hex value`),
        secondayColor: types
          .string()
          .required()
          .description(`the seconday color hex value`),
      }),
      squads: types.object({
        squadCounterText: types
          .string()
          .required()
          .description(`markdown string: copy for SquadCounter`),
        currentMissionSummary: types
          .string()
          .required()
          .description(`markdown string: copy for CurrentMission summary`),
        currentMissionDetails: types
          .string()
          .required()
          .description(`markdown string: copy for CurrentMission details`),
        currentMissionAlert: types
          .string()
          .required()
          .description(`markdown string: copy for CurrentMission alert`),
        currentMissionStep2: types
          .string()
          .required()
          .description(`markdown string: copy for CurrentMission step 2`),
        currentMissionStep3: types
          .string()
          .description(
            `optional markdown string: copy for CurrentMission step 3`
          ),
        missionCompleteAlert: types
          .string()
          .required()
          .description(`markdown string: copy for MissionComplete alert`),
        missionCompleteDescription: types
          .string()
          .required()
          .description(`markdown string: copy for MissionComplete copy text`),
        missionCompleteSubtitle: types
          .string()
          .required()
          .description(
            `optional markdown string: copy for MissionComplete subtitle`
          ),
        impactCounterText: types
          .string()
          .required()
          .description(
            `markdown string: copy for ImpactCounter caption when user is in mission`
          ),
      }),
      sharing: types.object({
        title: types
          .string()
          .required()
          .description(`markdown for modal title`),
        subtitle: types
          .string()
          .required()
          .description(`markdown for modal subtitle`),
        imgCategory: types
          .string()
          .required()
          .description(
            `value to use for img switch statement on frontend, probably ‘cats’ or ‘seas’`
          ),
        redditButtonTitle: types
          .string()
          .required()
          .description(`copy for reddit button`),
        facebookButtonTitle: types
          .string()
          .required()
          .description(`copy for facebook button`),
        twitterButtonTitle: types
          .string()
          .required()
          .description(`copy for twitter button`),
        tumblrTitle: types
          .string()
          .required()
          .description(`copy for tumblr button`),
        tumblrCaption: types
          .string()
          .required()
          .description(`copy for tumblr caption`),
        sendgridEmailTemplateId: types
          .string()
          .required()
          .description(`id for sendgridEmailTemplate`),
      }),
      onboarding: types.object({
        steps: types
          .array()
          .items(
            types.object({
              title: types
                .string()
                .required()
                .description(`title for onboarding step`),
              subtitle: types
                .string()
                .required()
                .description(`subtitle for onboarding step`),
              imgName: types
                .string()
                .required()
                .description(`name of image to show`),
            })
          )
          .required(),
        firstTabIntroDescription: types
          .string()
          .required()
          .description(
            `markdown string shown when prompting the user to open their first tab, currently info about cat treats`
          ),
      }),
    }
  }

  static get fieldDefaults() {
    return {}
  }
}

Cause.register()

export default Cause
