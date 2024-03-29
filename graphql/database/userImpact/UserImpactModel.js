import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_IMPACT } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends DynamoDBModel

 */
class UserImpact extends DynamoDBModel {
  static get name() {
    return USER_IMPACT
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'charityId'
  }

  static get tableName() {
    return tableNames.userImpact
  }

  static get schema() {
    const self = this
    return {
      userId: types
        .string()
        .required()
        .description(
          `The unique user ID from our authentication service (Firebase)`
        ),
      charityId: types
        .string()
        .required()
        .description(`the charity id that maps to the charity table`),
      userImpactMetric: types
        .number()
        .default(self.fieldDefaults.userImpactMetric)
        .description(
          `the metric a user contributes to a charity.  For example, it might be number of treats for
          cats.`
        ),
      pendingUserReferralImpact: types
        .number()
        .default(self.fieldDefaults.pendingUserReferralImpact)
        .description(`The impact a user has gained from referrals that has not yet 
        been claimed in the UI by the user`),
      pendingUserReferralCount: types
        .number()
        .default(self.fieldDefaults.pendingUserReferralCount)
        .description(
          `The number of friends a user has referred and hasn't claimed`
        ),
      hasClaimedLatestReward: types
        .boolean()
        .default(self.fieldDefaults.hasClaimedLatestReward)
        .description(
          `A flag that indicates if user has celebrated latest impact milestone`
        ),
      visitsUntilNextImpact: types
        .number()
        .default(self.fieldDefaults.visitsUntilNextImpact) // only set in app code
        .description(`A counter that decrements each time a user tabs until it reaches 0 and
        the user impact is incremented`),
      confirmedImpact: types
        .boolean()
        .default(self.fieldDefaults.confirmedImpact)
        .description(`enables a user to start earning user impact once they have opted in
        on the UI`),
    }
  }

  static get fieldDefaults() {
    return {
      userImpactMetric: 0,
      pendingUserReferralImpact: 0,
      pendingUserReferralCount: 0,
      visitsUntilNextImpact: 1,
      confirmedImpact: false,
      hasClaimedLatestReward: true,
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      getAll: () => false,
      update: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

UserImpact.register()

export default UserImpact
