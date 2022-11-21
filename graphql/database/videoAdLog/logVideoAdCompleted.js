import jsSHA from 'jssha'
import VideoAdLogModel from './VideoAdLogModel'
import isVideoAdEligible from './isVideoAdEligible'
import addVc from '../users/addVc'
import UserModel from '../users/UserModel'
import { TRUEX_APPLICATION_SECRET } from '../../config'
import {
  getPermissionsOverride,
  VIDEO_ADS_OVERRIDE,
} from '../../utils/permissions-overrides'

const override = getPermissionsOverride(VIDEO_ADS_OVERRIDE)
/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user's Id
 * @param {string} signatureArgumentString - the engagement’s signature_argument_string
 * @param {string} signature - the engagement’s signature
 * @param {string} videoAdId - returned from SetVideoAdStarted
 * @param {string} truexAdId - maps to DB field truexEngagementId
 * @param {string} truexCreativeId - maps to DB field truexCreativeId
 * @return {Promise<Object>}  A promise that resolves into an object containing a log id
 */

const applicationSecret = TRUEX_APPLICATION_SECRET
const failure = async (userContext, userId) => ({
  success: false,
  user: await UserModel.get(userContext, userId),
})
export default async (
  userContext,
  {
    userId,
    signatureArgumentString,
    signature,
    videoAdId,
    truexAdId,
    truexCreativeId,
  }
) => {
  const isEligible = await isVideoAdEligible(userContext, { id: userId })
  if (!isEligible) {
    return failure(userContext, userId)
  }
  // eslint-disable-next-line new-cap
  const shaObj = new jsSHA('SHA-256', 'TEXT', {
    hmacKey: { value: applicationSecret, format: 'TEXT' },
  })
  shaObj.update(signatureArgumentString)
  if (shaObj.getHash('HEX') !== signature) {
    return failure(userContext, userId)
  }
  const alreadyCreditedLog = await VideoAdLogModel.query(override, truexAdId)
    .usingIndex('VideoAdLogsByEngagementId')
    .execute()
  if (alreadyCreditedLog.length) {
    return failure(userContext, userId)
  }
  const videoAdLog = (
    await VideoAdLogModel.query(override, videoAdId)
      .usingIndex('VideoAdLogsByUniqueId')
      .execute()
  )[0]
  if (!videoAdLog) {
    return failure(userContext, userId)
  }
  const [updatedUser] = await Promise.all([
    addVc(userContext, userId, 100),
    VideoAdLogModel.update(userContext, {
      ...videoAdLog,
      truexEngagementId: truexAdId,
      truexCreativeId,
      completed: true,
    }),
  ])
  return { success: true, user: updatedUser }
}
