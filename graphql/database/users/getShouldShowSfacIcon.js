import {
  SFAC_EXISTING_USER_ACTIVITY_ICON,
  SFAC_EXTENSION_PROMPT,
} from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'

const getShouldShowSfacIcon = async (userContext, user) => {
  const newUserSFACNotifFeature = await getUserFeature(
    userContext,
    user,
    SFAC_EXTENSION_PROMPT
  )
  const existingUserSFACIconFeature = await getUserFeature(
    userContext,
    user,
    SFAC_EXISTING_USER_ACTIVITY_ICON
  )
  return (
    newUserSFACNotifFeature.variation === 'Notification' ||
    existingUserSFACIconFeature.variation === 'Icon'
  )
}

export default getShouldShowSfacIcon
