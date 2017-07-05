
export default function (adId) {
  var mockNetworkDelayMs = 0
  const useMockDelay = false
  if (useMockDelay) {
    mockNetworkDelayMs = Math.random() * (1500 - 900) + 900
  }

  // Mock returning an ad.
  setTimeout(() => {
    const elem = document.getElementById(adId)
    if (!elem) {
      return
    }
    elem.setAttribute('style', `
      color: white;
      background: repeating-linear-gradient(
        -55deg,
        #222,
        #222 20px,
        #333 20px,
        #333 40px
      );
      width: 100%;
      height: 100%;
    `)
  }, mockNetworkDelayMs)
}
