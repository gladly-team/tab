import { updateUserVc } from '../users/user'
import { addVcDonationLog } from './vcDonationLog'

import Async from 'asyncawait/async'
import Await from 'asyncawait/await'

const donateVc = Async(function (userId, charityId, vc) {
  const user = Await(updateUserVc(userId, -vc))
  Promise.resolve(addVcDonationLog(userId, charityId, vc))
  return user
})

export {
  donateVc
}
