
import getGoogleTag from './getGoogleTag'

export default function (adId) {
  const googletag = getGoogleTag()
  googletag.cmd.push(() => {
    googletag.display(adId)
  })
}
