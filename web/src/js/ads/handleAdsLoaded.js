import getGoogleTag from 'js/ads/google/getGoogleTag'
import logger from 'js/utils/logger'

// Keep track of what ad slots have loaded. App code loads later and
// therefore can miss the slot loading event. This gives the app code
// a way to check if the slots already loaded or not.
export default () => {
  try {
    const googletag = getGoogleTag()

    const storeRenderedSlotData = (slotId, eventData) => {
      window.tabforacause.ads.slotsRendered[slotId] = eventData
    }

    const markSlotAsViewable = slotId => {
      window.tabforacause.ads.slotsViewable[slotId] = true
    }

    const markSlotAsLoaded = slotId => {
      window.tabforacause.ads.slotsLoaded[slotId] = true
    }

    googletag.cmd.push(() => {
      // 'slotRenderEnded' event is at end of slot (iframe) render but before
      // the ad creative loads:
      // https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
      // 'impressionViewable' event is when the ad is mostly within view
      // for one second:
      // https://developers.google.com/doubleclick-gpt/reference#googletageventsimpressionviewableevent
      // 'slotOnload' event is on creative load:
      // https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent

      // Keep track of data for rendered slots
      googletag.pubads().addEventListener('slotRenderEnded', event => {
        try {
          const slotId = event.slot.getSlotElementId()
          storeRenderedSlotData(slotId, event)
        } catch (e) {
          logger.error(e)
        }
      })

      // Keep track of which slots have become viewable
      googletag.pubads().addEventListener('impressionViewable', event => {
        try {
          const slotId = event.slot.getSlotElementId()
          markSlotAsViewable(slotId)
        } catch (e) {
          logger.error(e)
        }
      })

      // Keep track of which slots have actually loaded creative
      googletag.pubads().addEventListener('slotOnload', event => {
        try {
          const slotId = event.slot.getSlotElementId()
          markSlotAsLoaded(slotId)
        } catch (e) {
          logger.error(e)
        }
      })
    })
  } catch (e) {
    logger.error(e)
  }
}
