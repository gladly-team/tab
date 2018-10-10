
import getGoogleTag from 'js/ads/google/getGoogleTag'

export default () => {
  const googletag = getGoogleTag()
  googletag.cmd.push(function () {
    googletag.defineSlot(
      '/43865596/HBTL',
      [[728, 90], [728, 210], [720, 300], [500, 350], [550, 480], [468, 60]],
      'div-gpt-ad-1464385677836-0'
    ).addService(googletag.pubads())
    googletag.defineSlot(
      '/43865596/HBTR',
      [[300, 250], [250, 250], [160, 600], [120, 600], [120, 240], [240, 400], [234, 60], [180, 150], [125, 125], [120, 90], [120, 60], [120, 30], [230, 33], [300, 600]],
      'div-gpt-ad-1464385742501-0'
    ).addService(googletag.pubads())
    googletag.pubads().enableSingleRequest()
    googletag.enableServices()
  })
}
