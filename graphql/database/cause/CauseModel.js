import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import { CAUSE, CAUSE_IMPACT_TYPES } from '../constants'

/*
 * @extends DynamoDBModel

 */
class Cause extends DynamoDBModel {
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
    const self = this

    const mapFieldsToRequired = (fields, except = {}) => {
      const copy = Object.assign({}, fields)
      Object.keys(copy).forEach((key) => {
        if (!(key in except)) {
          copy[key] = copy[key].required()
        }
      })
      return copy
    }

    const impactFields = {
      claimImpactSubtitle: types
        .string()
        .description(
          `markdown string: title for claimImpact notification in UserImpact`
        ),
      confirmImpactSubtitle: types
        .string()
        .description(
          `markdown string: copy for confirm impact modal in UserImpact`
        ),
      impactCounterText: types
        .string()
        .description(
          `markdown string: copy for ImpactCounter dropdown for normal case`
        ),
      impactIcon: types
        .string()
        .description(`string: name of the icon to use in impact counter`),
      impactWalkthroughText: types
        .string()
        .description(
          `markdown string: an intro description of impact. Used when onboarding in UserImpact.`
        ),
      newlyReferredImpactWalkthroughText: types
        .string()
        .description(
          `markdown string: copy for impact walkthrough notification in UserImpact when user is referred`
        ),
      referralRewardNotification: types
        .string()
        .description(`markdown string: copy for referral reward notification`),
      referralRewardSubtitle: types
        .string()
        .description(
          `markdown string: subtitle copy for referralReward UserImpact modal`
        ),
      referralRewardTitle: types
        .string()
        .description(
          `markdown string: title copy for referralReward UserImpact modal`
        ),
      walkMeGif: types
        .string()
        .description(`string: file name of the gif to use in walk me`),
    }

    const squadsFields = {
      currentMissionAlert: types
        .string()
        .description(`markdown string: copy for CurrentMission alert`),
      currentMissionDetails: types
        .string()
        .description(`markdown string: copy for CurrentMission details`),
      currentMissionStep2: types
        .string()
        .description(`markdown string: copy for CurrentMission step 2`),
      currentMissionStep3: types
        .string()
        .description(
          `optional markdown string: copy for CurrentMission step 3`
        ),
      currentMissionSummary: types
        .string()
        .description(`markdown string: copy for CurrentMission summary`),
      impactCounterText: types
        .string()
        .description(
          `markdown string: copy for ImpactCounter caption when user is in mission`
        ),
      missionCompleteAlert: types
        .string()
        .description(`markdown string: copy for MissionComplete alert`),
      missionCompleteDescription: types
        .string()
        .description(`markdown string: copy for MissionComplete copy text`),
      missionCompleteSubtitle: types
        .string()
        .description(
          `optional markdown string: copy for MissionComplete subtitle`
        ),
      squadCounterText: types
        .string()
        .description(`markdown string: copy for SquadCounter`),
      squadInviteTemplateId: types
        .string()
        .description(`the sendgrid email template for a squad invite`),
    }

    return {
      // TODO: additional restrictions, e.g. for nanoid
      id: types.string().required().description(`The ID for the cause.`),

      // Fields here are alphabetized (non-objects first).

      about: types
        .string()
        .required()
        .description(
          `Markdown - content that populates an "About the Cause" page`
        ),
      name: types
        .string()
        .required()
        .description(`String used to describe Cause in account page`),
      nameForShop: types
        .string()
        .required()
        .description(`String used to describe Cause on the shop extension.`),
      charityId: types
        .string()
        .required()
        .description(
          `Charity that this cause is currently generating impact for`
        ),
      isAvailableToSelect: types
        .boolean()
        .description('if a user can select this cause')
        .default(self.fieldDefaults.isAvailableToSelect),
      icon: types.string().description(`string: name of the icon`).required(),
      individualImpactEnabled: types
        .boolean()
        .optional()
        .description(
          `[Deprecated: use impactType instead] whether or not there is an individual impact metric for this cause`
        ),
      impactType: types
        .string()
        .valid(Object.values(CAUSE_IMPACT_TYPES))
        .required()
        .description(
          `The type of charitable impact that's enabled for this cause`
        ),
      impactVisits: types.alternatives().when('impactType', {
        is: CAUSE_IMPACT_TYPES.individual,
        then: types
          .number()
          .integer()
          .required()
          .description(
            `number of visits required for each impact unit (e.g. 14 for cat charity)`
          ),
        otherwise: types
          .number()
          .integer()
          .description(
            `number of visits required for each impact unit (e.g. 14 for cat charity)`
          ),
      }),
      backgroundImageCategory: types
        .string()
        .required()
        .description(
          `the background Image Category to show by default for a cause`
        ),
      landingPagePath: types
        .string()
        .required()
        .description(`URL path for the landing page belonging to this cause`),
      landingPagePhrase: types
        .string()
        .required()
        .description(`Phrase for the landing page belonging to this cause`),
      slug: types
        .string()
        .required()
        .description(
          `A short, unique, URL-safe description of the cause, such as "cats" or "teamseas"`
        ),
      impact: types.alternatives().when('impactType', {
        is: CAUSE_IMPACT_TYPES.individual,
        then: types.object(impactFields),
        otherwise: types.object(
          mapFieldsToRequired(impactFields, { walkMeGif: false })
        ),
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
        shareImage: types
          .string()
          .required()
          .description('Image to use in email invite dialog'),
        sentImage: types
          .string()
          .required()
          .description('Image shown after email invite sent'),
        redditButtonTitle: types
          .string()
          .required()
          .description(`copy for reddit button`),
        email: types.object({
          image: types
            .string()
            .required()
            .description(`url of landing image in email`),
          title: types.string().required().description(`title of email invite`),
          about: types
            .string()
            .required()
            .description(`stringified html about section`),
          faq: types
            .string()
            .required()
            .description(
              `cause sepcific faq info.  Can be pure string or stringified html`
            ),
          sendgridEmailTemplateId: types
            .string()
            .required()
            .description(`id for sendgridEmailTemplate`),
        }),
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
      squads: types.alternatives().when('impactType', {
        is: CAUSE_IMPACT_TYPES.individual,
        then: types.object(squadsFields),
        otherwise: types.object(mapFieldsToRequired(squadsFields)),
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
      charityIds: types
        .array()
        .items(types.string())
        .description(
          `Charities that this cause is currently generating impact for`
        ),
    }
  }

  static get fieldDefaults() {
    return { isAvailableToSelect: false }
  }
}

Cause.register()

export default Cause
