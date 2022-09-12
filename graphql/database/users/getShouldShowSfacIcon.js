import { SFAC_EXTENSION_PROMPT } from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'
import { GROWTHBOOK_ENV } from '../../config'

const getShouldShowSfacIcon = async (userContext, user) => {
  const showSfacExtensionFeature = await getUserFeature(
    userContext,
    user,
    SFAC_EXTENSION_PROMPT
  )
  return (
    GROWTHBOOK_ENV === 'dev' &&
    showSfacExtensionFeature.variation === 'Notification'
  )
}

export default getShouldShowSfacIcon
