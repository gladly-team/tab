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
  const [adMounted, setAdMounted] = useState(false)

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

  // If an ad exists, add event handlers.
  useEffect(() => {
    log('adding event handlers')

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
        setAdMounted(false)
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

  // If the parent container is not open, mark the ad
  // as unmounted.
  useEffect(() => {
    if (!open) {
      setAdMounted(false)
    }
  }, [open])

  // Mount the ad when the parent container is open.
  useEffect(() => {
    if (!open) {
      return
    }
    if (!adContainer) {
      log('PROBLEM: no ad container')
      return
    }
    if (adMounted) {
      log('not mounting, ad already mounted.')
      return
    }
    log('mounting ad')
    setAdMounted(true) // prevent mounting more than once
    trueX.client.loadActivityIntoContainer(trueX.ad, adContainer)
  }, [adContainer, adMounted, open, trueX.ad, trueX.client])

  return
}

export default useTrueX
