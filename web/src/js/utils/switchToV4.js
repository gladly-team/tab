import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_NEW_USER_IS_TAB_V4_BETA } from 'js/constants'
import { reloadDashboard } from 'js/navigation/navigation'
import SetUserCauseMutation from 'js/mutations/SetUserCauseMutation'
import { goTo } from 'js/navigation/navigation'

// Opt the user into v4 and refresh.
const switchToV4 = async ({
  relayEnvironment,
  userId,
  causeId,
  redirect = '',
}) => {
  await Promise.all([
    optIntoV4Beta(),
    SetUserCauseMutation(relayEnvironment, userId, causeId),
    localStorageMgr.setItem(STORAGE_NEW_USER_IS_TAB_V4_BETA, 'true'),
    SetV4BetaMutation({
      userId: userId,
      enabled: true,
    }),
  ])

  if (redirect) {
    goTo(redirect)
  } else {
    reloadDashboard()
  }
}

export default switchToV4
