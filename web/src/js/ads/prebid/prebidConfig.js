
import { getPrebidPbjs } from './getPrebidPbjs'

// See: http://prebid.org/dev-docs/examples/basic-example.html
export default function () {
  // Prebid config section START
  // Make sure this is inserted before your GPT tag.
  const prebidTimeoutMs = 1000

  // Note: brealtime is automatically aliased by the
  // AppNexus bid adapter.
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
        bidder: 'openx',
        params: {
          unit: '538658529',
          delDomain: 'tabforacause-d.openx.net'
        }
      },
      {
        bidder: 'brealtime',
        params: {
          placementId: '10955690'
        }
      },
      {
        bidder: 'rhythmone',
        params: {
          placementId: '73423'
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
        bidder: 'openx',
        params: {
          unit: '538658529',
          delDomain: 'tabforacause-d.openx.net'
        }
      },
      {
        bidder: 'brealtime',
        params: {
          placementId: '10955287'
        }
      },
      {
        bidder: 'rhythmone',
        params: {
          placementId: '73423'
        }
      }
    ]
  }]
  // Prebid config section END

  const googletag = window.googletag || {}
  googletag.cmd = googletag.cmd || []

  // Also called prior to loading Amazon bidder.
  // Leaving this here to prevent breakage in case we
  // reorder bidder loading order.
  googletag.cmd.push(() => {
    googletag.pubads().disableInitialLoad()
  })

  const pbjs = getPrebidPbjs()

  pbjs.que.push(() => {
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

    // BEGIN: profile and debug ad performance
    var adPerfKey = 'prebidBidsRequested'
    var adPerfName = 'Prebid bids requested'
    var adPerfLogs = window.adPerfLogs || {}
    var adPerfTime = window.performance.now()
    adPerfLogs[adPerfKey] = {
      time: adPerfTime,
      name: adPerfName
    }
    console.log('Adperf: ' + adPerfName, adPerfTime)
    // END: profile and debug ad performance
  })

  function sendAdserverRequest () {
    if (pbjs.adserverRequestSent) {
      return
    }

    // BEGIN: profile and debug ad performance
    if (window.performance && window.performance.now) {
      var adPerfKey = 'adserverRequestSent'
      var adPerfName = 'DFP request sent (via Prebid)'
      var adPerfLogs = window.adPerfLogs || {}
      var adPerfTime = window.performance.now()
      adPerfLogs[adPerfKey] = {
        time: adPerfTime,
        name: adPerfName
      }
      console.log('Adperf: ' + adPerfName, adPerfTime)
    }
    // END: profile and debug ad performance

    pbjs.adserverRequestSent = true
    googletag.cmd.push(() => {
      pbjs.que.push(() => {
        pbjs.setTargetingForGPTAsync()
        googletag.pubads().refresh()

        // BEGIN: profile and debug ad performance
        if (window.performance && window.performance.now) {
          var adPerfKey = 'adserverRequestActuallySent'
          var adPerfName = 'DFP request sent (via Prebid), for real'
          var adPerfLogs = window.adPerfLogs || {}
          var adPerfTime = window.performance.now()
          adPerfLogs[adPerfKey] = {
            time: adPerfTime,
            name: adPerfName
          }
          console.log('Adperf: ' + adPerfName, adPerfTime)
        }
        // END: profile and debug ad performance
      })
    })
  }

  setTimeout(() => {
    sendAdserverRequest()
  }, prebidTimeoutMs)
}
