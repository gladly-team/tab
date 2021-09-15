import { useEffect, useState, useCallback } from 'react'
import { requestAd } from 'js/utils/truex'

const log = msg => {
  console.log('true[X]: [%s] - %s', new Date().toLocaleTimeString(), msg)
}

// Requests an ad on mount, calls event handlers, and mounts the ad
// in an ad container when opened.
const useTrueX = ({
  open = false,
  adContainer = null,
  onAdAvailable = () => {},
  onStart = () => {},
  onClose = () => {},
  onFinish = () => {},
}) => {
  const [trueX, setTrueX] = useState({
    ad: undefined,
    client: undefined,
  })
  const [fetchComplete, setFetchComplete] = useState(false)
  const fetchAd = useCallback(() => {
    const fetch = async () => {
      log('fetching ad')
      setFetchComplete(false)
      const { ad, client } = await requestAd()
      setTrueX({
        ad,
        client,
      })
      log('fetch complete')
      setFetchComplete(true)
    }
    fetch()
  }, [])

  // On mount, see if an ad is available.
  useEffect(() => {
    fetchAd()
  }, [fetchAd])

  useEffect(() => {
    // If an ad exists, add event handlers.
    if (trueX.ad) {
      onAdAvailable()

      // Ad started.
      trueX.ad.onStart(activity => {
        log('start')
        onStart()
      })

      // User spent 30 seconds and interacted at least once.
      trueX.ad.onCredit(engagement => {
        log('credit!')
        console.log(engagement)
      })

      // User closed the ad unit.
      trueX.ad.onClose(activity => {
        log('close')
        onClose()

        // Refresh ads to see if another is available.
        fetchAd()
      })

      // User got to end of ad.
      trueX.ad.onFinish(activity => {
        log('finish')
        onFinish()
      })

      trueX.ad.onMessage(payload => {
        log('onMessage = ' + payload)
      })
    } else {
      if (fetchComplete) {
        log('No ads available.')
      }
    }
  }, [
    fetchAd,
    fetchComplete,
    onAdAvailable,
    onClose,
    onFinish,
    onStart,
    trueX.ad,
  ])

  useEffect(() => {
    if (open && adContainer) {
      // TODO
      console.log('TODO: mount ad')
      //   trueX.client.loadActivityIntoContainer(
      //   trueX.ad,
      //   document.getElementById('content'),
      //   { width: '960px', height: '540px' }
      // )
    }
  }, [adContainer, open])

  return
}

export default useTrueX
