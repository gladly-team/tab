
import { getGoogleTag } from '../google/googleTag'
import { getPrebidPbjs } from './getPrebidPbjs'

// See: http://prebid.org/dev-docs/examples/basic-example.html
export default function () {
  // Prebid config section START
  // Make sure this is inserted before your GPT tag.
  const prebidTimeoutMs = 800

  const adUnits = [{
    code: 'div-gpt-ad-1464385742501-0',
    sizes: [[300, 250]],
    bids: [
      {
        bidder: 'sonobi',
        params: {
          dom_id: 'div-gpt-ad-1464385742501-0',
          ad_unit: '/43865596/HBTR'
        }
      },
      {
        bidder: 'pulsepoint',
        params: {
          cf: '300X250',
          cp: '560174',
          ct: '460982'
        }
      },
      {
        bidder: 'aol',
        params: {
          network: '10559.1',
          placement: '4117692',
          alias: 'desktop_newtab_300x250',
          sizeId: '170'
        }
      },
      {
        bidder: 'sovrn',
        params: {
          tagid: '438916'
        }
      },
      {
        bidder: 'brealtime',
        params: {
          placementId: '10955690'
        }
      }
    ]
  },
  {
    code: 'div-gpt-ad-1464385677836-0',
    sizes: [[728, 90]],
    bids: [
      {
        bidder: 'sonobi',
        params: {
          dom_id: 'div-gpt-ad-1464385677836-0',
          ad_unit: '/43865596/HBTL'
        }
      },
      {
        bidder: 'pulsepoint',
        params: {
          cf: '728X90',
          cp: '560174',
          ct: '460981'
        }
      },
      {
        bidder: 'aol',
        params: {
          network: '10559.1',
          placement: '4117691',
          alias: 'desktop_newtab_728x90',
          sizeId: '225'
        }
      },
      {
        bidder: 'sovrn',
        params: {
          tagid: '438918'
        }
      },
      {
        bidder: 'brealtime',
        params: {
          placementId: '10955287'
        }
      }
    ]
  }]
  // Prebid config section END

  const googletag = getGoogleTag()

  googletag.cmd.push(() => {
    googletag.pubads().disableInitialLoad()
  })

  const pbjs = getPrebidPbjs()

  pbjs.que.push(() => {
    // Randomize the order in which bidders are called to
    // level the playing field.
    pbjs.setBidderSequence('random')

    pbjs.enableAnalytics({
      provider: 'roxot',
      options: {
        publisherIds: ['3cc4009c-e5a8-4e42-b1e1-340448ebf317']
      }
    })

    pbjs.addAdUnits(adUnits)

    pbjs.bidderSettings = {
      aol: {
        // AOL sends gross CPM.
        bidCpmAdjustment: function (bidCpm) {
          return bidCpm * 0.80
        }
      }
    }

    pbjs.requestBids({
      bidsBackHandler: sendAdserverRequest
    })
  })

  function sendAdserverRequest () {
    if (pbjs.adserverRequestSent) {
      return
    }
    pbjs.adserverRequestSent = true
    googletag.cmd.push(() => {
      pbjs.que.push(() => {
        pbjs.setTargetingForGPTAsync()
        googletag.pubads().refresh()
      })
    })
  }

  setTimeout(() => {
    sendAdserverRequest()
  }, prebidTimeoutMs)
}
