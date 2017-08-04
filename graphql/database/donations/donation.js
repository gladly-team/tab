import UserModel from '../users/UserModel'
import { addVcDonationLog } from './vcDonationLog'

import Async from 'asyncawait/async'
import Await from 'asyncawait/await'

// TODO: test
const donateVc = Async(function (userContext, userId, charityId, vc) {
  const user = Await(UserModel.addVc(userContext, userId, -vc))
  Promise.resolve(addVcDonationLog(userId, charityId, vc))
  return user
})

export {
  donateVc
}
