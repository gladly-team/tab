import { updateUserVc } from './updateUserVc'
import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
/**
 * Rewards a referring user
 * @param {String} referringUserId - The referring user id.
 */
var rewardReferringUser = Async(function (referringUserId) {
  Await(updateUserVc(referringUserId, 350))
})

export {
  rewardReferringUser
}
