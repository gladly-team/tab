
// Keep track of what ad slots have loaded. App code loads later and
// therefore can miss the slot loading event. This gives the app code
// a way to check if the slots already loaded or not.
export default function () {
  try {
    const googletag = window.googletag || {}
    googletag.cmd = googletag.cmd || []

    const markSlotAsLoaded = (slotId, eventData) => {
      window.tabforacause.ads.slotsLoaded[slotId] = eventData
    }

    googletag.cmd.push(() => {
      // 'slotRenderEnded' event is at end of slot (iframe) render but before
      // the ad creative loads:
      // https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
      // 'slotOnload' event is on creative load:
      // https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent
      googletag.pubads().addEventListener('slotRenderEnded', (event) => {
        try {
          const slotId = event.slot.getSlotElementId()
          markSlotAsLoaded(slotId, event)
        } catch (e) {
          console.error('Could not mark ad slots as loaded', e)
        }
      })
    })
  } catch (e) {
    console.error('Could not handle GPT slot loaded event', e)
  }
}
