
import getGoogleTag from 'js/ads/google/getGoogleTag'

export default function (adId) {
  const googletag = getGoogleTag()
  googletag.cmd.push(() => {
    googletag.display(adId)
  })
}
