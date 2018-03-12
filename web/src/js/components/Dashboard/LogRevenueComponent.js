import React from 'react'
import LogUserRevenueMutation from 'mutations/LogUserRevenueMutation'
import PropTypes from 'prop-types'

// Log revenue from ads
class LogRevenueComponent extends React.Component {
  componentWillMount () {
    this.listenForSlotsLoadedEvent()
    this.logRevenueForAlreadyLoadedAds()
  }

  /**
   * Get the top bid for the slot from Prebid and log the revenue.
   * @param {string} slotId - The DFP slot ID to log
   * @param {Object} event - The googletag "SlotOnload" event object. See:
   *  https://developers.google.com/doubleclick-gpt/reference#googletageventsslotonloadevent
   * @return {null}
   */
  logRevenueForSlotId (slotId, event) {
    try {
      // If we have already logged revenue for this slot, don't log it again
      if (slotId in window.tabforacause.ads.slotsAlreadyLoggedRevenue) {
        return
      }
      // Mark that we've logged revenue for this slot
      window.tabforacause.ads.slotsAlreadyLoggedRevenue[slotId] = true

      // Get the slot's highest CPM bid from Prebid
      const pbjs = window.pbjs || {}
      pbjs.que = pbjs.que || []
      const slotBids = pbjs.getHighestCpmBids(slotId)

      // There might not be any bids
      if (!slotBids.length) {
        return
      }
      const cpm = slotBids[0].cpm
      const revenue = cpm / 1000

      // To avoid unnecessary precision, round to 14 decimal places
      const roundedRevenue = Math.round(revenue * 10e14) / 10e14

      // Get the advertiser ID. It will be null if Google Adsense
      // took the impression, so assume nulls are Adsense.
      const GOOGLE_ADSENSE_ID = 99
      const dfpAdvertiserId = (
        event.advertiserId
        ? event.advertiserId
        : GOOGLE_ADSENSE_ID
      )

      // Log the revenue
      LogUserRevenueMutation(this.props.relay.environment,
        this.props.user.id, roundedRevenue, dfpAdvertiserId)
    } catch (e) {
      console.error('Could not log revenue for ad slot', e)
    }
  }

  // Check if any ad slots have already loaded. If so,
  // log the revenue for those slots.
  logRevenueForAlreadyLoadedAds () {
    try {
      // This may be set earlier by ads code (outside of core app code)
      const slotsLoadedObj = window.tabforacause.ads.slotsLoaded
      if (Object.keys(slotsLoadedObj).length) {
        const self = this
        Object.keys(slotsLoadedObj).forEach((slotId) => {
          // The property value is the "SlotOnload" event object
          self.logRevenueForSlotId(slotId, slotsLoadedObj[slotId])
        })
      }
    } catch (e) {
      console.error('Could not log revenue for ad slot', e)
    }
  }

  // Listen for the Google ad load event
  listenForSlotsLoadedEvent () {
    const googletag = window.googletag || {}
    googletag.cmd = googletag.cmd || []
    googletag.cmd.push(() => {
      // 'slotRenderEnded' event is at end of slot (iframe) render but before
      // the ad creative loads:
      // https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
      // 'slotOnload' event is on creative load:
      // https://developers.google.com/doubleclick-gpt/reference#googletageventsslotonloadevent
      googletag.pubads().addEventListener('slotOnload', (event) => {
        try {
          const slotId = event.slot.getSlotElementId()
          this.logRevenueForSlotId(slotId, event)
        } catch (e) {
          console.error('Could not log revenue for ad slot', e)
        }
      })
    })
  }

  render () {
    return null
  }
}

LogRevenueComponent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  relay: PropTypes.shape({
    environment: PropTypes.object.isRequired
  })
}

export default LogRevenueComponent
