import { SFAC_EXTENSION_PROMPT } from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'

const getShouldShowSfacExtensionPrompt = async (userContext, user) => {
  const showSfacExtensionFeature = await getUserFeature(
    userContext,
    user,
    SFAC_EXTENSION_PROMPT
  )
  const alreadyResponded =
    user.sfacPrompt && user.sfacPrompt.hasRespondedToPrompt
  return (
    !alreadyResponded && showSfacExtensionFeature.variation === 'Notification'
  )
}

export default getShouldShowSfacExtensionPrompt
