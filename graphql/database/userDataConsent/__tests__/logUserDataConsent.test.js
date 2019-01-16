/* eslint-env jest */

import moment from 'moment'
import {
  addTimestampFieldsToItem,
  getMockUserContext,
  mockDate,
} from '../../test-utils'

jest.mock('../../databaseClient')

jest.mock('consent-string', () => ({
  // https://facebook.github.io/jest/docs/en/es6-class-mocks.html#simple-mock-using-module-factory-parameter
  ConsentString: jest.fn(() => () => ({})),
}))

const mockConsentData = {
  created: moment.utc().toISOString(),
  lastUpdated: moment.utc().toISOString(),
  version: 1,
  vendorListVersion: 31,
  cmpId: 12,
  consentScreen: 28,
  cmpVersion: 1,
  purposesAllowed: [1, 2, 5],
  vendorsAllowed: [1, 4, 30, 233, 501],
}

const getMockConsentDataClass = consentData => ({
  created: consentData.created,
  lastUpdated: consentData.lastUpdated,
  getVersion: () => consentData.version,
  getVendorListVersion: () => consentData.vendorListVersion,
  getCmpId: () => consentData.cmpId,
  getConsentScreen: () => consentData.consentScreen,
  getCmpVersion: () => consentData.cmpVersion,
  getPurposesAllowed: () => consentData.purposesAllowed,
  getVendorsAllowed: () => consentData.vendorsAllowed,
})

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

afterEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

afterAll(() => {
  mockDate.off()
})

describe('logUserDataConsent', () => {
  test('calls DB to create a log as expected', async () => {
    const userId = userContext.id
    const UserDataConsentModel = require('../UserDataConsentModel').default
    const userDataConsentCreate = jest.spyOn(UserDataConsentModel, 'create')

    // Mock decoding the consent string
    const { ConsentString } = require('consent-string')
    ConsentString.mockImplementationOnce(() =>
      getMockConsentDataClass(mockConsentData)
    )

    const logUserDataConsent = require('../logUserDataConsent').default
    await logUserDataConsent(userContext, userId, 'fake-consent-string', true)

    expect(userDataConsentCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        consentString: 'fake-consent-string',
        consentCreated: mockConsentData.created,
        consentLastUpdated: mockConsentData.lastUpdated,
        version: mockConsentData.version,
        vendorListVersion: mockConsentData.vendorListVersion,
        cmpId: mockConsentData.cmpId,
        cmpVersion: mockConsentData.cmpVersion,
        consentScreen: mockConsentData.consentScreen,
        allowedPurposeIds: mockConsentData.purposesAllowed,
        allowedVendorIds: mockConsentData.vendorsAllowed,
        isGlobalConsent: true,
      })
    )
  })

  test('consent-string module decodes consent string as expected', async () => {
    const userId = userContext.id
    const UserDataConsentModel = require('../UserDataConsentModel').default
    const userDataConsentCreate = jest.spyOn(UserDataConsentModel, 'create')

    // Use real consent-string library
    jest.unmock('consent-string')

    // Actual encoded consent string
    const consentStr =
      'BOOPq4VOOPr7lABABBENAb-AAAAT17______b9_3__7_9uz_Kv_K7Xf_nnW0721PVA_rXOz_gE7YRAEIAkA'

    const logUserDataConsent = require('../logUserDataConsent').default
    await logUserDataConsent(userContext, userId, consentStr, false)

    expect(userDataConsentCreate.mock.calls[0][1]).toMatchObject(
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        consentString: consentStr,
        consentCreated: '2018-05-24T04:50:35.700Z',
        consentLastUpdated: '2018-05-24T04:57:46.100Z',
        version: mockConsentData.version,
        vendorListVersion: 27,
        cmpId: 1,
        cmpVersion: 1,
        consentScreen: 1,
        allowedPurposeIds: [1, 2, 3, 4, 5],
        allowedVendorIds: [
          1,
          2,
          3,
          4,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          45,
          46,
          48,
          49,
          50,
          51,
          52,
          53,
          55,
          56,
          57,
          58,
          59,
          60,
          61,
          62,
          63,
          65,
          66,
          67,
          68,
          69,
          70,
          71,
          72,
          73,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          82,
          84,
          85,
          86,
          87,
          88,
          89,
          90,
          91,
          92,
          93,
          94,
          95,
          97,
          98,
          100,
          101,
          102,
          104,
          105,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          118,
          120,
          122,
          124,
          125,
          126,
          127,
          128,
          129,
          130,
          131,
          132,
          133,
          136,
          138,
          140,
          141,
          142,
          144,
          145,
          147,
          149,
          150,
          151,
          153,
          154,
          155,
          156,
          157,
          158,
          159,
          160,
          161,
          162,
          163,
          164,
          167,
          168,
          169,
          170,
          173,
          174,
          175,
          177,
          179,
          180,
          182,
          183,
          185,
          188,
          189,
          190,
          192,
          193,
          194,
          195,
          197,
          198,
          200,
          201,
          203,
          205,
          208,
          209,
          210,
          211,
          213,
          215,
          217,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          232,
          234,
          235,
          237,
          239,
          240,
          241,
          244,
          245,
          246,
          248,
          249,
          252,
          253,
          254,
          255,
          256,
          257,
          258,
          259,
          260,
          269,
          272,
          273,
          274,
          276,
          277,
          279,
          280,
          285,
          289,
          299,
          304,
          314,
          317,
        ],
        isGlobalConsent: false,
      })
    )
  })
})
