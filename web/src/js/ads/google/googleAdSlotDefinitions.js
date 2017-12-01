
export default function () {
  const googletag = window.googletag || {}
  googletag.cmd = googletag.cmd || []

  googletag.cmd.push(function () {
    googletag.defineSlot('/43865596/HBTL', [728, 90], 'div-gpt-ad-1464385677836-0').addService(googletag.pubads())
    googletag.defineSlot('/43865596/HBTR', [300, 250], 'div-gpt-ad-1464385742501-0').addService(googletag.pubads())

    googletag.pubads().enableSingleRequest()
    googletag.enableServices()
  })
}
