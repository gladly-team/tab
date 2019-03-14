/* eslint-env jest */

import getAmazonTag, {
  __disableAutomaticBidResponses,
  __runBidsBack,
} from 'js/ads/amazon/getAmazonTag'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import { getDefaultTabGlobal, mockAmazonBidResponse } from 'js/utils/test-utils'
import { getNumberOfAdsToShow } from 'js/ads/adSettings'

jest.mock('js/ads/adSettings')
jest.mock('js/ads/consentManagement')
jest.mock('js/ads/amazon/getAmazonTag')

beforeEach(() => {
  // Mock apstag
  delete window.apstag
  window.apstag = getAmazonTag()

  // Mock tabforacause global
  window.tabforacause = getDefaultTabGlobal()

  // Set up googletag
  delete window.googletag
  window.googletag = getGoogleTag()
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.googletag
  delete window.apstag
  delete window.tabforacause
})

describe('amazonBidder', () => {
  it('runs without error', async () => {
    expect.assertions(0)
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()
  })

  it('calls apstag.init with the expected publisher ID and ad server', async () => {
    expect.assertions(1)
    const apstag = getAmazonTag()

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()

    expect(apstag.init.mock.calls[0][0]).toMatchObject({
      pubID: '3397',
      adServer: 'googletag',
    })
  })

  it('calls apstag.fetchBids', async () => {
    getNumberOfAdsToShow.mockReturnValue(2)
    const apstag = getAmazonTag()

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()

    expect(apstag.fetchBids).toHaveBeenCalled()
    expect(apstag.fetchBids.mock.calls[0][0]).toMatchObject({
      slots: [
        {
          slotID: 'div-gpt-ad-24682468-0',
          sizes: [[728, 90]],
        },
        {
          slotID: 'div-gpt-ad-1357913579-0',
          sizes: [[300, 250]],
        },
      ],
      timeout: 700,
    })
  })

  it('uses ad sizes provided by the ads settings', async () => {
    getNumberOfAdsToShow.mockReturnValue(2)
    const apstag = getAmazonTag()
    const {
      getVerticalAdSizes,
      getHorizontalAdSizes,
    } = require('js/ads/adSettings')
    getVerticalAdSizes.mockReturnValueOnce([[250, 250], [300, 600]])
    getHorizontalAdSizes.mockReturnValueOnce([[728, 90], [720, 300]])

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()
    expect(apstag.fetchBids.mock.calls[0][0]).toMatchObject({
      slots: [
        {
          slotID: 'div-gpt-ad-24682468-0',
          sizes: [[728, 90], [720, 300]],
        },
        {
          slotID: 'div-gpt-ad-1357913579-0',
          sizes: [[250, 250], [300, 600]],
        },
      ],
      timeout: 700,
    })
  })

  it('resolves immediately when we expect the mock to return bids immediately', async () => {
    expect.assertions(1)

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    const promise = amazonBidder()
    promise.done = false
    promise.then(() => {
      promise.done = true
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))
    expect(promise.done).toBe(true)
  })

  it('only resolves after the auction ends', async () => {
    expect.assertions(2)
    __disableAutomaticBidResponses()

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    const promise = amazonBidder()
    promise.done = false
    promise.then(() => {
      promise.done = true
    })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(promise.done).toBe(false)
    __runBidsBack()

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(promise.done).toBe(true)
  })

  it('stores Amazon bids in tabforacause window variable', async () => {
    expect.assertions(4)

    // Mock apstag's `fetchBids` so we can invoke the callback function
    var passedCallback
    window.apstag.fetchBids.mockImplementation((config, callback) => {
      passedCallback = callback
    })

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    const storeAmazonBids = require('js/ads/amazon/amazonBidder')
      .storeAmazonBids
    amazonBidder()

    // Fake that apstag calls callback for returned bids
    const someBid = mockAmazonBidResponse({
      amznbid: 'some-id',
      slotID: 'div-gpt-ad-123456789-0',
    })
    const someOtherBid = mockAmazonBidResponse({
      amznbid: 'some-other-id',
      slotID: 'div-gpt-ad-24681357-0',
    })
    passedCallback([someBid, someOtherBid])

    // Should not have stored the bids yet.
    expect(
      window.tabforacause.ads.amazonBids['div-gpt-ad-123456789-0']
    ).toBeUndefined()
    expect(
      window.tabforacause.ads.amazonBids['div-gpt-ad-24681357-0']
    ).toBeUndefined()

    storeAmazonBids()

    // Now should have stored the bids.
    expect(
      window.tabforacause.ads.amazonBids['div-gpt-ad-123456789-0']
    ).toEqual(someBid)
    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-24681357-0']).toEqual(
      someOtherBid
    )
  })

  it('does not call apstag.fetchBids when zero ads are enabled', async () => {
    getNumberOfAdsToShow.mockReturnValue(0)
    const apstag = getAmazonTag()
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()
    expect(apstag.fetchBids).not.toHaveBeenCalled()
  })

  it('only gets bids for the leaderboard ad when one ad is enabled', async () => {
    getNumberOfAdsToShow.mockReturnValue(1)
    const {
      getVerticalAdSizes,
      getHorizontalAdSizes,
    } = require('js/ads/adSettings')
    getVerticalAdSizes.mockReturnValue([[300, 250]])
    getHorizontalAdSizes.mockReturnValue([[728, 90]])
    const apstag = getAmazonTag()
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()
    expect(apstag.fetchBids).toHaveBeenCalled()
    expect(apstag.fetchBids.mock.calls[0][0]).toMatchObject({
      slots: [
        {
          slotID: 'div-gpt-ad-24682468-0',
          sizes: [[728, 90]],
        },
      ],
    })
  })

  it('gets bids for the leaderboard and rectangle ads when two ads are enabled', async () => {
    getNumberOfAdsToShow.mockReturnValue(2)
    const apstag = getAmazonTag()
    const {
      getVerticalAdSizes,
      getHorizontalAdSizes,
    } = require('js/ads/adSettings')
    getVerticalAdSizes.mockReturnValue([[300, 250]])
    getHorizontalAdSizes.mockReturnValue([[728, 90]])
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()
    expect(apstag.fetchBids).toHaveBeenCalled()
    expect(apstag.fetchBids.mock.calls[0][0]).toMatchObject({
      slots: [
        {
          slotID: 'div-gpt-ad-24682468-0',
          sizes: [[728, 90]],
        },
        {
          slotID: 'div-gpt-ad-1357913579-0',
          sizes: [[300, 250]],
        },
      ],
    })
  })

  it('gets bids for the leaderboard and rectangle ads when three ads are enabled', async () => {
    getNumberOfAdsToShow.mockReturnValue(3)
    const apstag = getAmazonTag()
    const {
      getVerticalAdSizes,
      getHorizontalAdSizes,
    } = require('js/ads/adSettings')
    getVerticalAdSizes.mockReturnValue([[300, 250]])
    getHorizontalAdSizes.mockReturnValue([[728, 90]])
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()
    expect(apstag.fetchBids).toHaveBeenCalled()
    expect(apstag.fetchBids.mock.calls[0][0]).toMatchObject({
      slots: [
        {
          slotID: 'div-gpt-ad-24682468-0',
          sizes: [[728, 90]],
        },
        {
          slotID: 'div-gpt-ad-1357913579-0',
          sizes: [[300, 250]],
        },
        {
          slotID: 'div-gpt-ad-11235813-0',
          sizes: [[300, 250]],
        },
      ],
    })
  })
})

describe('amazonBidder creative message handler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('adds a message event listener to the window', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder()
    expect(mockAddEventListener).toHaveBeenCalledTimes(1)
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
      false
    )
  })

  it('does not do anything if the message does not come from the Google SafeFrame', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const mockMessageEvent = {
      origin: 'http://some-site.com',
      data: {
        type: 'apstag',
        adId: 'abc-123',
      },
      source: {
        postMessage: jest.fn(),
      },
    }

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder()
    const messageHandler = mockAddEventListener.mock.calls[0][1]
    const returnVal = messageHandler(mockMessageEvent)
    expect(returnVal).toBe(false)
    expect(mockMessageEvent.source.postMessage).not.toHaveBeenCalled()
  })

  it('does not do anything if the ad ID is not defined', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const mockMessageEvent = {
      origin: 'https://tpc.googlesyndication.com',
      data: {
        type: 'apstag',
        adId: undefined,
      },
      source: {
        postMessage: jest.fn(),
      },
    }

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder()
    const messageHandler = mockAddEventListener.mock.calls[0][1]
    const returnVal = messageHandler(mockMessageEvent)
    expect(returnVal).toBe(false)
    expect(mockMessageEvent.source.postMessage).not.toHaveBeenCalled()
  })

  it('posts a message to the SafeFrame', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const mockMessageEvent = {
      origin: 'https://tpc.googlesyndication.com',
      data: {
        type: 'apstag',
        adId: 'abc-123',
      },
      source: {
        postMessage: jest.fn(),
      },
    }

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder()
    const messageHandler = mockAddEventListener.mock.calls[0][1]
    const returnVal = messageHandler(mockMessageEvent)
    expect(returnVal).toBe(true)
    expect(mockMessageEvent.source.postMessage).toHaveBeenCalledTimes(1)
  })

  it('posts a message to the SafeFrame with document data of the ad and the correct target domain', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const mockMessageEvent = {
      origin: 'https://tpc.googlesyndication.com',
      data: {
        type: 'apstag',
        adId: 'abc-123',
      },
      source: {
        postMessage: jest.fn(),
      },
    }
    window.apstag.renderImp.mockImplementationOnce((doc, adId) => {
      doc.body.innerHTML = '<div>foobar</div>'
      doc.head.innerHTML = '<title>HI!</title>'
    })

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder()
    const messageHandler = mockAddEventListener.mock.calls[0][1]
    messageHandler(mockMessageEvent)
    expect(mockMessageEvent.source.postMessage).toHaveBeenCalledWith(
      {
        type: 'apstagResponse',
        adDocumentData: {
          title: 'HI!',
          headHTML: '<title>HI!</title>',
          bodyHTML: '<div>foobar</div>',
          cookie: '',
        },
      },
      'https://tpc.googlesyndication.com'
    )
  })
})

describe('amazonBidder SafeFrame creative', () => {
  it('adds a message event listener to the window', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const {
      apstagSafeFrameCreativeCode,
    } = require('js/ads/amazon/amazonBidder')
    apstagSafeFrameCreativeCode()
    expect(mockAddEventListener).toHaveBeenCalledTimes(1)
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
      false
    )
  })

  it('modifies the document if the message has the correct structure', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const mockMessageEvent = {
      origin: 'https://tab.gladly.io',
      data: {
        type: 'apstagResponse',
        adDocumentData: {
          bodyHTML: '<div>hi</div>',
          cookie: '',
          headHTML: '<link rel="shortcut icon" href="favicon.ico">',
          title: 'My Title',
        },
      },
    }

    window.document.body.innerHTML = '<span>some stuff</span>'

    const {
      apstagSafeFrameCreativeCode,
    } = require('js/ads/amazon/amazonBidder')
    apstagSafeFrameCreativeCode()
    const messageHandler = mockAddEventListener.mock.calls[0][1]
    const returnVal = messageHandler(mockMessageEvent)
    expect(window.document.body.innerHTML).toEqual('<div>hi</div>')
    expect(window.document.head.innerHTML).toEqual(
      '<link rel="shortcut icon" href="favicon.ico"><title>My Title</title>'
    )
    expect(window.document.title).toEqual('My Title')
    expect(returnVal).toBe(true)
  })

  it('ignores messages that do not come from an expected origin', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const mockMessageEvent = {
      origin: 'https://tab.gladly.io',
      data: {
        type: 'apstagResponse',
        adDocumentData: {
          bodyHTML: '<div>hi</div>',
          cookie: '',
          headHTML: '',
          title: '',
        },
      },
    }
    const {
      apstagSafeFrameCreativeCode,
    } = require('js/ads/amazon/amazonBidder')
    apstagSafeFrameCreativeCode()
    const messageHandler = mockAddEventListener.mock.calls[0][1]

    const acceptedOrigins = [
      'https://tab.gladly.io',
      'https://dev-tab2017.gladly.io',
      'https://localhost:3000',
      'https://local-dev-tab.gladly.io:3000',
    ]
    acceptedOrigins.forEach(domain => {
      let msg = Object.assign({}, mockMessageEvent, {
        origin: domain,
      })
      console.log(msg)
      expect(messageHandler(msg)).toBe(true)
    })

    const rejectedOrigins = [
      'https://foo.gladly.io',
      'http://localhost:3000', // not HTTPS
      'https://some-other-site.com',
      'https://tab.gladly.io.foobar.io',
    ]
    rejectedOrigins.forEach(domain => {
      let msg = Object.assign({}, mockMessageEvent, {
        origin: domain,
      })
      expect(messageHandler(msg)).toBe(false)
    })
  })

  it('does not modify the document if the message does not have the "apstagResponse" type', () => {
    const mockAddEventListener = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(() => {})
    const mockMessageEvent = {
      origin: 'https://tab.gladly.io',
      data: {
        type: 'something',
        adDocumentData: {
          bodyHTML: '<div>hi</div>',
          cookie: '',
          headHTML: '',
          title: '',
        },
      },
    }

    window.document.body.innerHTML = '<span>some stuff</span>'

    const {
      apstagSafeFrameCreativeCode,
    } = require('js/ads/amazon/amazonBidder')
    apstagSafeFrameCreativeCode()
    const messageHandler = mockAddEventListener.mock.calls[0][1]
    const returnVal = messageHandler(mockMessageEvent)
    expect(window.document.body.innerHTML).toEqual('<span>some stuff</span>')
    expect(returnVal).toBe(false)
  })

  it('posts a message to the parent window', () => {
    const mockParentPostMessage = jest
      .spyOn(window.parent, 'postMessage')
      .mockImplementation(() => {})
    const {
      apstagSafeFrameCreativeCode,
    } = require('js/ads/amazon/amazonBidder')
    apstagSafeFrameCreativeCode()
    expect(mockParentPostMessage).toHaveBeenCalledTimes(1)
  })

  it('posts a message with the expected structure', () => {
    const mockParentPostMessage = jest
      .spyOn(window.parent, 'postMessage')
      .mockImplementation(() => {})
    const {
      apstagSafeFrameCreativeCode,
    } = require('js/ads/amazon/amazonBidder')
    apstagSafeFrameCreativeCode()
    expect(mockParentPostMessage).toHaveBeenCalledWith(
      {
        type: 'apstag',
        adId: '%%PATTERN:amzniid%%',
      },
      '*'
    )
  })

  it('catches any thrown errors and logs to the console', () => {
    const mockErr = new Error('Error in the apstag creative!')
    jest.spyOn(window.parent, 'postMessage').mockImplementationOnce(() => {
      throw mockErr
    })
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    const {
      apstagSafeFrameCreativeCode,
    } = require('js/ads/amazon/amazonBidder')
    apstagSafeFrameCreativeCode()
    expect(console.error).toHaveBeenCalledWith(mockErr)
  })
})
