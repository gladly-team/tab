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
   * Get the Prebid revenue for this slot
   * @param {string} slotId - The DFP slot ID
   * @return {number|null} revenue - The $USD revenue equal to the highest Prebid
   *   bid CPM for the slot, divided by 1000 and rounded; null if there were no bids
   */
  getPrebidRevenueForSlot (slotId) {
    // Get the slot's highest CPM bid from Prebid
    const pbjs = window.pbjs || {}
    pbjs.que = pbjs.que || []
    const slotBids = pbjs.getHighestCpmBids(slotId)

    // There might not be any bids
    if (!slotBids.length) {
      return null
    }

    // Convert to real revenue
    const cpm = slotBids[0].cpm
    const revenue = cpm / 1000

    // To avoid unnecessary precision, round to 14 decimal places
    const roundedRevenue = Math.round(revenue * 10e14) / 10e14
    return roundedRevenue
  }

  /**
   * Get the Amazon bid for this slot
   * @param {string} slotId - The DFP slot ID
   * @return {Object|null} encodedAmazonRevenue - An EncodedRevenueValueType if there
   *   is a bid for the slot, or null if there is no bid
   * @return {string} encodedAmazonRevenue.encodingType - A constant, 'AMAZON_CPM',
   *   which tells the backend how to decode the value
   * @return {string} encodedAmazonRevenue.encodedValue - The Amazon revenue code
   */
  getEncodedAmazonRevenueForSlot (slotId) {
    const amazonBids = window.tabforacause.ads.amazonBids
    const amazonBidExists = (
      amazonBids &&
      amazonBids[slotId] &&
      amazonBids[slotId]['amznbid'] !== '' && // An empty string means no bid
      amazonBids[slotId]['amzniid'] !== '' // An empty string means no bid
    )
    if (!amazonBidExists) {
      return null
    }
    return {
      encodingType: 'AMAZON_CPM',
      encodedValue: window.tabforacause.ads.amazonBids[slotId]['amznbid']
    }
  }

  /**
   * Gets the googletag "SlotRenderEnded" event object for a slot ID.
   * The event data will be stored by ad code outside the core app code.
   * @param {string} slotId - The DFP slot ID to log
   * @return {Object|null} The googletag "SlotRenderEnded" event object. See:
   *  https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent
   *  Returns null if we do not have any stored event data.
   */
  getSlotRenderEndedDataForSlotId (slotId) {
    var slotRenderEndedData = null
    try {
      slotRenderEndedData = window.tabforacause.ads.slotsRendered[slotId]
    } catch (e) {
      console.error(e)
    }
    return slotRenderEndedData
  }

  /**
   * Get the bid for the slot and log the revenue.
   * @param {string} slotId - The DFP slot ID to log
   * @return {null}
   */
  logRevenueForSlotId (slotId) {
    try {
      // If we have already logged revenue for this slot, don't log it again
      if (slotId in window.tabforacause.ads.slotsAlreadyLoggedRevenue) {
        return
      }
      // Mark that we've logged revenue for this slot
      window.tabforacause.ads.slotsAlreadyLoggedRevenue[slotId] = true

      // Get data for the rendered slot
      const slotRenderedData = this.getSlotRenderEndedDataForSlotId(slotId)
      if (!slotRenderedData) {
        console.warn(`Could not find rendered slot data for slot "${slotId}"`)
        return
      }

      // Get revenue from highest Prebid bid
      const prebidRevenue = this.getPrebidRevenueForSlot(slotId)

      // Get the slot's bid from Amazon
      const amazonEncodedBid = this.getEncodedAmazonRevenueForSlot(slotId)

      // If no revenue, don't log anything
      if (!prebidRevenue && !amazonEncodedBid) {
        return
      }

      // Get the advertiser ID. It will be null if Google Adsense
      // took the impression, so assume nulls are Adsense.
      const GOOGLE_ADSENSE_ID = '99'
      const dfpAdvertiserId = (
        slotRenderedData.advertiserId
        ? slotRenderedData.advertiserId.toString()
        : GOOGLE_ADSENSE_ID
      )

      // Log the revenue
      LogUserRevenueMutation(
        this.props.relay.environment,
        this.props.user.id,
        prebidRevenue,
        dfpAdvertiserId,
        amazonEncodedBid,
        // Only send aggregationOperation value if we have more than one
        // revenue value
        ((prebidRevenue && amazonEncodedBid) ? 'MAX' : null)
      )
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
      // TODO:
      // When a slot's becomes viewable, log its revenue

      // When a slot's creative loads, log its revenue
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
  }).isRequired,
  relay: PropTypes.shape({
    environment: PropTypes.object.isRequired
  })
}

export default LogRevenueComponent
