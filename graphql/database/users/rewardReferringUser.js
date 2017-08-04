
import UserModel from './UserModel'
import {
  USER_REFERRAL_VC_REWARD
} from '../constants'
import {
  getPermissionsOverride
} from '../../utils/authorization-helpers'

const rewardReferringUser = async (referringUserId) => {
  const permissionsOverride = getPermissionsOverride()
  await UserModel.addVc(permissionsOverride, referringUserId,
    USER_REFERRAL_VC_REWARD)
}

export default rewardReferringUser
