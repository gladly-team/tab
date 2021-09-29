import { useEffect, useState, useCallback } from 'react'
import { requestAd } from 'js/utils/truex'
import CreateVideoAdLogMutation from 'js/mutations/CreateVideoAdLogMutation'
import LogVideoAdCompleteMutation from 'js/mutations/LogVideoAdCompleteMutation'
const log = (...msg) => {
  console.log('true[X]: [%s] - %s', new Date().toLocaleTimeString(), ...msg)
}

// Awaiting true[X] setup or fetching an ad.
export const WAITING = 'WAITING'

// Setup/fetch complete. Does not mean an ad is necessarily available.
export const READY = 'READY'

// User started the engagement.
export const STARTED = 'STARTED'

// User completed the engagement.
export const COMPLETED = 'COMPLETED'

// User closed the engagement. When this is the status, the parent
// container should also close.
export const CLOSED = 'CLOSED'

// Requests an ad on mount, calls event handlers, and mounts the ad
// in an ad container when opened.
const useTrueX = ({
  truexUserId,
  userId,
  videoAdEligible,
  open = false,
  adContainer = null,
}) => {
  const [trueX, setTrueX] = useState({
    ad: undefined,
    client: undefined,
  })
  const [fetchInProgress, setFetchInProgress] = useState(false)
  const [fetchComplete, setFetchComplete] = useState(false)
  const [adAvailable, setAdAvailable] = useState(false)
  const [adMounted, setAdMounted] = useState(false)
  const [status, setStatus] = useState(WAITING)
  const [credited, setCredited] = useState(false)
  const [uniqueVideoAdId, setUniqueVideoAdId] = useState()
  const fetchAd = useCallback(() => {
    const fetch = async () => {
      log('fetching ad')
      setFetchInProgress(true)
      setFetchComplete(false)
      const { ad, client } = await requestAd({
        userId: truexUserId,
      })
      setTrueX({
        ad,
        client,
      })
      log('fetch complete')
      setFetchComplete(true)
      setFetchInProgress(false)
    }
    fetch()
  }, [truexUserId])

  // On mount, see if an ad is available if user has not completed 3 ads already.
  useEffect(() => {
    if (videoAdEligible) {
      fetchAd()
    }
  }, [fetchAd, videoAdEligible])

  // Cleanup: call when the ad has been closed
  const reset = useCallback(() => {
    log('resetting')
    setStatus(WAITING)
    setAdAvailable(false)
    setAdMounted(false)
    setCredited(false)

    // Refresh ads to see if another is available.
    if (fetchInProgress) {
      log('not fetching, fetch already in progress')
    } else {
      fetchAd()
    }
  }, [fetchAd, fetchInProgress])

  // If an ad exists, add event handlers.
  useEffect(() => {
    log('adding event handlers')

    if (trueX.ad) {
      // Ad started.
      trueX.ad.onStart(async activity => {
        log('start', activity)
        const {
          createVideoAdLog: {
            VideoAdLog: { id: adId },
          },
        } = await CreateVideoAdLogMutation({ userId })
        setUniqueVideoAdId(adId)
        // TODO: call backend to log ad start

        setStatus(STARTED)
      })

      // User spent 30 seconds and interacted at least once.
      trueX.ad.onCredit(async engagement => {
        log('credit earned')
        log('engagement:', engagement)
        const {
          ad: { creative_id },
          key,
          signature,
          signature_argument_string,
        } = engagement
        // TODO: call backend to verify signature, validate rate-limiting,
        // and credit user.
        const {
          logVideoAdComplete: { success },
        } = await LogVideoAdCompleteMutation({
          userId,
          signatureArgumentString: signature_argument_string,
          signature,
          videoAdId: uniqueVideoAdId,
          truexAdId: key,
          truexCreativeId: creative_id,
        })
        if (success) {
          setCredited(true)
        }
      })

      // User closed the ad unit.
      trueX.ad.onClose(activity => {
        log('closed')
        setStatus(CLOSED)
      })

      // User got to end of ad.
      trueX.ad.onFinish(activity => {
        log('finished')
        setStatus(COMPLETED)
      })

      trueX.ad.onMessage(payload => {
        log('onMessage = ' + payload)
      })

      // "Triggered when an error has occurred with the ad.
      // This should be considered an exception. It's best
      // practice to remove the ad container when this occurs."
      // https://github.com/socialvibe/truex-ads-docs/blob/master/js_ad_api.md#ad-object
      trueX.ad.onError(error => {
        log('error = ' + error)

        // The parent should close the container.
        setStatus(CLOSED)
      })

      // Set that true[X] is ready to go.
      setStatus(READY)
      setAdAvailable(true)
    } else {
      if (fetchComplete) {
        setStatus(READY)
        log('No ads available.')
      }
    }
  }, [fetchAd, fetchComplete, reset, trueX.ad, userId, uniqueVideoAdId])

  // If the parent container closes during an ad, reset
  // all state.
  const adInProgress = [STARTED, COMPLETED, CLOSED].indexOf(status) > -1
  useEffect(() => {
    // log(`parent closed - open = ${open}`)
    // log(`parent  - adInProgress = ${adInProgress}`)
    if (!open && adInProgress) {
      reset()
    }
  }, [open, reset, adInProgress])

  // Mount the ad when the parent container is open.
  useEffect(() => {
    if (!open) {
      return
    }
    if (!adContainer) {
      log('problem: no ad container')
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

  return {
    adAvailable,
    status,
    credited,
  }
}

export default useTrueX
