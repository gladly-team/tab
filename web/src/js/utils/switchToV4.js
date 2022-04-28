import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_NEW_USER_IS_TAB_V4_BETA } from 'js/constants'
import { reloadDashboard } from 'js/navigation/navigation'
import SetUserCauseMutation from 'js/mutations/SetUserCauseMutation'

// Opt the user into v4 and refresh.
const switchToV4 = async ({ relayEnvironment, userId, causeId }) => {
  await optIntoV4Beta()
  await SetUserCauseMutation(relayEnvironment, userId, causeId)
  await localStorageMgr.setItem(STORAGE_NEW_USER_IS_TAB_V4_BETA, 'true')
  await SetV4BetaMutation({
    userId: userId,
    enabled: true,
  })
  reloadDashboard()
}

export default switchToV4
