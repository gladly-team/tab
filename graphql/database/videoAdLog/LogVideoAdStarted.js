import { nanoid } from 'nanoid'
import VideoAdLogModel from './VideoAdLogModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user's Id
 * @return {Promise<Object>}  A promise that resolves into an object containing a log id
 */

export default async (userContext, userId) =>
  VideoAdLogModel.create(userContext, { userId, id: nanoid(16) })
