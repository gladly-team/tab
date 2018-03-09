import React from 'react'
import LogUserRevenueMutation from 'mutations/LogUserRevenueMutation'
import PropTypes from 'prop-types'

// Log revenue from ads
class LogRevenueComponent extends React.Component {
  componentWillMount () {
    this.listenForSlotsLoadedEvent()
    this.logRevenueForAlreadyLoadedAds()
  }

  // Get the top bid for the slot from Prebid and log the revenue
  logRevenueForSlotId (slotId) {
    try {
      // If we have already logged revenue for this slot, don't log it again
      if (slotId in window.tabforacause.ads.slotsAlreadyLoggedRevenue) {
        return
      }
      // Mark that we've logged revenue for this slot
      window.tabforacause.ads.slotsAlreadyLoggedRevenue.slotId = true

      // Get the slot's highest CPM bid from Prebid
      const pbjs = window.pbjs || {}
      pbjs.que = pbjs.que || []
      const slotBids = pbjs.getHighestCpmBids(slotId)

      // There might not be any bids
      if (!slotBids.length) {
        console.log('No bids for slot ID:', slotId)
        return
      }
      const cpm = slotBids[0].cpm
      const revenue = cpm / 1000

      // To avoid unnecessary precision, round to 14 decimal places
      const roundedRevenue = Math.round(revenue * 10e14) / 10e14

      // Log the revenue
      console.log('Logging revenue for slot ID:', slotId, 'Revenue:', roundedRevenue)
      LogUserRevenueMutation(this.props.relay.environment,
        this.props.user.id, roundedRevenue)
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
          self.logRevenueForSlotId(slotId)
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
          this.logRevenueForSlotId(slotId)
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
  }).isRequired
}

export default LogRevenueComponent
