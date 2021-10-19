import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
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
    // This ORM assumes a DynamoDB table, but we're not using one here.
    return 'UNUSED_Causes'
  }

  static get schema() {
    return {
      // TODO: additional restrictions, e.g. for nanoid
      id: types
        .string()
        .required()
        .description(`The ID for the cause.`),

      // Fields here are alphabetized (non-objects first).

      charityId: types
        .string()
        .required()
        .description(
          `Charity that this cause is currently generating impact for`
        ),
      impactVisits: types
        .number()
        .integer()
        .required()
        .description(
          `number of visits required for each impact unit (e.g. 14 for cat charity)`
        ),
      landingPagePath: types
        .string()
        .required()
        .description(`URL path for the landing page belonging to this cause`),
      slug: types
        .string()
        .required()
        .description(
          `A short, unique, URL-safe description of the cause, such as "cats" or "teamseas"`
        ),
      impact: types.object({
        claimImpactSubtitle: types
          .string()
          .required()
          .description(
            `markdown string: title for claimImpact notification in UserImpact`
          ),
        confirmImpactSubtitle: types
          .string()
          .required()
          .description(
            `markdown string: copy for confirm impact modal in UserImpact`
          ),
        impactCounterText: types
          .string()
          .required()
          .description(
            `markdown string: copy for ImpactCounter dropdown for normal case`
          ),
        impactIcon: types
          .string()
          .required()
          .description(`string: name of the icon to use in impact counter`),
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
        referralRewardNotification: types
          .string()
          .required()
          .description(
            `markdown string: copy for referral reward notification`
          ),
        referralRewardSubtitle: types
          .string()
          .required()
          .description(
            `markdown string: subtitle copy for referralReward UserImpact modal`
          ),
        referralRewardTitle: types
          .string()
          .required()
          .description(
            `markdown string: title copy for referralReward UserImpact modal`
          ),
        walkMeGif: types
          .string()
          .required()
          .description(`string: file name of the gif to use in walk me`),
      }),
      onboarding: types.object({
        firstTabIntroDescription: types
          .string()
          .required()
          .description(
            `markdown string shown when prompting the user to open their first tab, currently info about cat treats`
          ),
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
      }),
      sharing: types.object({
        facebookButtonTitle: types
          .string()
          .required()
          .description(`copy for facebook button`),
        imgCategory: types
          .string()
          .required()
          .description(
            `value to use for img switch statement on frontend; e.g. "cats" or "seas"`
          ),
        redditButtonTitle: types
          .string()
          .required()
          .description(`copy for reddit button`),
        sendgridEmailTemplateId: types
          .string()
          .required()
          .description(`id for sendgridEmailTemplate`),
        subtitle: types
          .string()
          .required()
          .description(`markdown for modal subtitle`),
        title: types
          .string()
          .required()
          .description(`markdown for modal title`),
        tumblrCaption: types
          .string()
          .required()
          .description(`copy for tumblr caption`),
        tumblrTitle: types
          .string()
          .required()
          .description(`copy for tumblr button`),
        twitterButtonTitle: types
          .string()
          .required()
          .description(`copy for twitter button`),
      }),
      squads: types.object({
        currentMissionAlert: types
          .string()
          .required()
          .description(`markdown string: copy for CurrentMission alert`),
        currentMissionDetails: types
          .string()
          .required()
          .description(`markdown string: copy for CurrentMission details`),
        currentMissionStep2: types
          .string()
          .required()
          .description(`markdown string: copy for CurrentMission step 2`),
        currentMissionStep3: types
          .string()
          .description(
            `optional markdown string: copy for CurrentMission step 3`
          ),
        currentMissionSummary: types
          .string()
          .required()
          .description(`markdown string: copy for CurrentMission summary`),
        impactCounterText: types
          .string()
          .required()
          .description(
            `markdown string: copy for ImpactCounter caption when user is in mission`
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
        squadCounterText: types
          .string()
          .required()
          .description(`markdown string: copy for SquadCounter`),
      }),
      theme: types.object({
        primaryColor: types
          .string()
          .required()
          .description(`the primary color hex value`),
        secondaryColor: types
          .string()
          .required()
          .description(`the secondary color hex value`),
      }),
    }
  }

  static get fieldDefaults() {
    return {}
  }
}

Cause.register()

export default Cause
