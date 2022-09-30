import moment from 'moment'
import { SFAC_ACTIVITY_STATES } from '../constants'
import {
  SFAC_EXTENSION_PROMPT,
  SFAC_EXTENSION_PROMPT_CUTOFF_UNIX_TIME,
} from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'
import getSfacActivityState from './getSfacActivityState'

const getShouldShowSfacExtensionPrompt = async (userContext, user) => {
  const showSfacExtensionFeature = await getUserFeature(
    userContext,
    user,
    SFAC_EXTENSION_PROMPT
  )
  const newUserShowSfacCriteria =
    showSfacExtensionFeature.variation === 'Notification'

  // TFAC-1138
  const sfacActivityState = await getSfacActivityState(userContext, user)
  const existingUserShowSfacCriteria =
    sfacActivityState !== SFAC_ACTIVITY_STATES.ACTIVE &&
    user.tabs > 4 &&
    moment(user.joined).isBefore(moment(SFAC_EXTENSION_PROMPT_CUTOFF_UNIX_TIME))

  const alreadyResponded =
    user.sfacPrompt && user.sfacPrompt.hasRespondedToPrompt
  return (
    (newUserShowSfacCriteria || existingUserShowSfacCriteria) &&
    !alreadyResponded
  )
}

export default getShouldShowSfacExtensionPrompt
