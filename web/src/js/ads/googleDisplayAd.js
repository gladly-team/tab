
import { getGoogleTag } from './googleTag'

export default function (adId) {
  var googletag = getGoogleTag()
  googletag.cmd.push(() => {
    googletag.display(adId)
  })
}
