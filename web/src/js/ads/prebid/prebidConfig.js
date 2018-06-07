
import getPrebidPbjs from './getPrebidPbjs'
import { isInEuropeanUnion } from 'utils/client-location'
import {
  CONSENT_MANAGEMENT_TIMEOUT
} from '../adSettings'

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
    const isInEU = await isInEuropeanUnion()
    const requiresConsentManagement = !!isInEU

    // Note: brealtime is automatically aliased by the
    // AppNexus bid adapter.
    const adUnits = [{
      code: 'div-gpt-ad-1464385742501-0',
      mediaTypes: {
        banner: {
          sizes: [
            [300, 250]
          ]
        }
      },
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
      mediaTypes: {
        banner: {
          sizes: [
            [728, 90]
          ]
        }
      },
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
