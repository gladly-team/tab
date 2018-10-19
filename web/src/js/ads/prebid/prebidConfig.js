
import getPrebidPbjs from 'js/ads/prebid/getPrebidPbjs'
import { isInEuropeanUnion } from 'js/utils/client-location'
import {
  getNumberOfAdsToShow,
  getVerticalAdSizes,
  getHorizontalAdSizes,
  CONSENT_MANAGEMENT_TIMEOUT,
  VERTICAL_AD_UNIT_ID,
  VERTICAL_AD_SLOT_DOM_ID,
  SECOND_VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_UNIT_ID,
  HORIZONTAL_AD_SLOT_DOM_ID
} from 'js/ads/adSettings'

const getAdUnits = () => {
  const numAdsToShow = getNumberOfAdsToShow()

  // Leaderboard-style ad with all bidders
  const horizontalAdUnit = {
    code: HORIZONTAL_AD_SLOT_DOM_ID,
    mediaTypes: {
      banner: {
        sizes: getHorizontalAdSizes()
      }
    },
    bids: [
      {
        bidder: 'sonobi',
        params: {
          dom_id: HORIZONTAL_AD_SLOT_DOM_ID,
          ad_unit: HORIZONTAL_AD_UNIT_ID
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
  }

  // Rectangle-style ad with all bidders
  const verticalAdUnitForTwoAds = {
    code: VERTICAL_AD_SLOT_DOM_ID,
    mediaTypes: {
      banner: {
        sizes: getVerticalAdSizes()
      }
    },
    bids: [
      {
        bidder: 'sonobi',
        params: {
          dom_id: VERTICAL_AD_SLOT_DOM_ID,
          ad_unit: VERTICAL_AD_UNIT_ID
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
  }

  // Rectangle-style ad with some bidders for when
  // we are showing three ads
  const firstVerticalAdUnitForThreeAds = {
    code: VERTICAL_AD_SLOT_DOM_ID,
    mediaTypes: {
      banner: {
        sizes: getVerticalAdSizes()
      }
    },
    bids: [
      {
        bidder: 'sonobi',
        params: {
          dom_id: VERTICAL_AD_SLOT_DOM_ID,
          ad_unit: VERTICAL_AD_UNIT_ID
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
      }
    ]
  }

  // Second rectangle-style ad with some bidders for when
  // we are showing three ads
  const secondVerticalAdUnitForThreeAds = {
    code: SECOND_VERTICAL_AD_SLOT_DOM_ID,
    mediaTypes: {
      banner: {
        sizes: getVerticalAdSizes()
      }
    },
    bids: [
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
        bidder: 'rhythmone',
        params: {
          placementId: '73423'
        }
      }
    ]
  }

  if (!numAdsToShow) {
    return []
  } else if (numAdsToShow === 1) {
    return [horizontalAdUnit]
  } else if (numAdsToShow === 2) {
    return [
      horizontalAdUnit,
      verticalAdUnitForTwoAds
    ]
  } else {
    return [
      horizontalAdUnit,
      firstVerticalAdUnitForThreeAds,
      secondVerticalAdUnitForThreeAds
    ]
  }
}

/**
 * Return a promise that resolves when the Prebid auction is
 * complete. For a setup example, see:
 * http://prebid.org/dev-docs/examples/basic-example.html
 * @return {Promise<undefined>} Resolves when the Prebid
 *   auction completes (either all bids back or bid requests
 *   time out).
 */
export default () => {
  return new Promise(async (resolve, reject) => {
    // Determine if the user is in the EU, which may affect the
    // ads we show.
    var isInEU
    try {
      isInEU = await isInEuropeanUnion()
    } catch (e) {
      isInEU = false
    }
    const requiresConsentManagement = !!isInEU

    const adUnits = getAdUnits()

    const pbjs = getPrebidPbjs()

    pbjs.que.push(() => {
      // http://prebid.org/dev-docs/publisher-api-reference.html#module_pbjs.setConfig
      const protocol = process.env.WEBSITE_PROTOCOL ? process.env.WEBSITE_PROTOCOL : 'https'
      const publisherDomain = `${protocol}://${process.env.WEBSITE_DOMAIN}`
      const pagePath = window.location.pathname
      pbjs.setConfig({
        // bidderTimeout: 700 // default
        publisherDomain: publisherDomain, // Used for SafeFrame creative
        // Overrides the page URL adapters should use. Otherwise, some adapters
        // will use the current frame's URL while others use the top frame URL.
        // Only some adapters use this setting as of May 2018.
        // https://github.com/prebid/Prebid.js/issues/1882
        pageUrl: `${publisherDomain}${pagePath}`,
        // GDPR consent. Only enable the consentManagement module here
        // if consent is required, to avoid the unnecessary delay of calling
        // the CMP.
        // http://prebid.org/dev-docs/modules/consentManagement.html
        ...(requiresConsentManagement && {
          consentManagement: {
            cmpApi: 'iab',
            timeout: CONSENT_MANAGEMENT_TIMEOUT,
            allowAuctionWithoutConsent: true
          }
        })
      })

      pbjs.addAdUnits(adUnits)

      // Note: brealtime is automatically aliased by the
      // AppNexus bid adapter.
      pbjs.bidderSettings = {
        aol: {
        // AOL sends gross CPM.
          bidCpmAdjustment: function (bidCpm) {
            return bidCpm * 0.80
          }
        }
      }

      pbjs.requestBids({
        bidsBackHandler: handleAuctionEnd
      })
    })

    function handleAuctionEnd () {
      resolve()
    }
  })
}
