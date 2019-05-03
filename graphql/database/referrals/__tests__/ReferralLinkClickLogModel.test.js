/* eslint-env jest */

import tableNames from '../../tables'
import ReferralLinkClickLog from '../ReferralLinkClickLogModel'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'

jest.mock('../../databaseClient')

describe('ReferralLinkClickLog', () => {
  it('implements the name property', () => {
    expect(ReferralLinkClickLog.name).toBe('ReferralLinkClickLog')
  })

  it('implements the hashKey property', () => {
    expect(ReferralLinkClickLog.hashKey).toBe('userId')
  })

  it('implements the tableName property', () => {
    expect(ReferralLinkClickLog.tableName).toBe(tableNames.referralLinkClickLog)
  })

  it('has the correct get permission', () => {
    expect(ReferralLinkClickLog.permissions.get).toBeUndefined()
  })

  it('has the correct getAll permission', () => {
    expect(ReferralLinkClickLog.permissions.getAll).toBeUndefined()
  })

  it('has the correct update permission', () => {
    expect(ReferralLinkClickLog.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(ReferralLinkClickLog.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })
})
