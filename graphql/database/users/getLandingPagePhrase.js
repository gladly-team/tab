import { V4_SUPPORTING_STATEMENTS } from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'
import UserModel from './UserModel'

const getLandingPagePhrase = async (userContext, cause) => {
  const user = await UserModel.get(userContext, userContext.id)

  const feature = await getUserFeature(
    userContext,
    user,
    V4_SUPPORTING_STATEMENTS
  )

  return feature.variation === 'Experiment'
    ? cause.landingPagePhrase
    : `Supporting: ${cause.name}`
}

export default getLandingPagePhrase
