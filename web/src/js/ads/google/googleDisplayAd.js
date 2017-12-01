
export default function (adId) {
  const googletag = window.googletag || {}
  googletag.cmd = googletag.cmd || []
  googletag.cmd.push(() => {
    googletag.display(adId)
  })
}
