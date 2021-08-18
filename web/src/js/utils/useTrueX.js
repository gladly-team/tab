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
  const [trueXClient, setTrueXClient] = useState()
  const [trueXAd, setTrueXAd] = useState()

  const fetchAd = useCallback(() => {
    const fetch = async () => {
      const { ad: tXAd, client: tXClient } = await requestAd()
      setTrueXClient(tXClient)
      setTrueXAd(tXAd)
    }
    fetch()
  }, [])

  // On mount, see if an ad is available.
  useEffect(() => {
    fetchAd()
  }, [fetchAd])

  useEffect(() => {
    // If an ad exists, add event handlers.
    if (trueXAd) {
      onAdAvailable()

      // Ad started.
      trueXAd.onStart(activity => {
        log('start')
        onStart()
      })

      // User spent 30 seconds and interacted at least once.
      trueXAd.onCredit(engagement => {
        log('credit!')
        console.log(engagement)
      })

      // User closed the ad unit.
      trueXAd.onClose(activity => {
        log('close')
        onClose()

        // Refresh ads to see if another is available.
        fetchAd()
      })

      // User got to end of ad.
      trueXAd.onFinish(activity => {
        log('finish')
        onFinish()
      })

      trueXAd.onMessage(payload => {
        log('onMessage = ' + payload)
      })
    } else {
      log('No ads available.')
    }
  }, [fetchAd, onAdAvailable, onClose, onFinish, onStart, trueXAd])

  useEffect(() => {
    if (open && adContainer) {
      // TODO
      console.log('TODO: mount ad')
      //   trueXClient.loadActivityIntoContainer(
      //   trueXAd,
      //   document.getElementById('content'),
      //   { width: '960px', height: '540px' }
      // )
    }
  }, [adContainer, open])

  return
}

export default useTrueX
