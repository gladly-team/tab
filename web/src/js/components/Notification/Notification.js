'use client'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import gtag from 'js/analytics/google-analytics'
import switchToV4 from 'js/utils/switchToV4'
import environment from 'js/relay-env'

const isBrowser = typeof window !== 'undefined'

const sParams = {
  Version: '',
  NotificationOverride: null,
}

if (isBrowser) {
  // eslint-disable-next-line no-undef
  const p = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  sParams.Version = p.version || ''
  sParams.NotificationOverride = p['notification-override'] || ''
}

// Example Overrides: ?notification-override=leaderboard-change-flat
// Example Overrides: ?notification-override=leaderboard-change-down
// Example Overrides: ?notification-override=leaderboard-change-up
// Example Overrides: ?notification-override=vote-america-boot-up-june-2024&version=Version1
const Notification = ({ slot, user, onOpenLeaderboard }) => {
  const [show, setShow] = useState(true)
  const [height, setHeight] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [openWidget, setOpenWidget] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')
  const [notification, setNotification] = useState('')
  const [version, setVersion] = useState('')

  // User is not loaded yet.
  if (!user) {
    return null
  }

  if (typeof window === 'undefined') {
    return null
  }

  //
  // Called when widget is closed by user.
  //
  const onClose = () => {
    setOpenWidget(false)
    gtag('event', `${slot}_${notification}_close`)
    gtag('event', `${slot}_${notification}_${version}_close`)
  }

  // Function to handle received messages
  function receiveMessage(event, scopeSlot) {
    // TODO(spicer): Add origin check for added security
    // if (event.origin !== 'http://127.0.0.1:9000') return

    // Check if the message is for us. If not, ignore it.
    if (typeof event.data.show === 'undefined') return

    // Check if the message is for us. If not, ignore it.
    if (event.data.slot !== scopeSlot) {
      return
    }

    // Did we get the version? - Which version of the notification did we show?
    if (event.data.version) {
      setVersion(event.data.version)
    }

    // Did we get the notification? - Which notification did we show?
    if (event.data.notification) {
      setNotification(event.data.notification)
    }

    // Do we want to show the notification?
    if (event.data.show) {
      setShow(true)
      setHeight(event.data.height)

      if (event.data.slot === 'modal-center') {
        setShowModal(true)
      }
    } else {
      setShow(false)
      setHeight(0)

      if (event.data.slot === 'modal-center') {
        setShowModal(false)
      }
    }

    // Did we get a new iframe URL?
    if (event.data.iframe) {
      setIframeUrl(event.data.iframe)
      setOpenWidget(true)
    }

    // See if we have any actions
    if (event.data.action) {
      switch (event.data.action) {
        // Open the leaderboard
        case 'leaderboard-open':
          if (onOpenLeaderboard) {
            onOpenLeaderboard()
          }
          break

        // Reload the entire page.
        case 'reload-page':
          // document.cookie =
          //   'tabV4OptIn=enabled; expires=Thu, 18 Dec 2028 12:00:00 UTC'
          // window.location.reload()

          switchToV4({
            relayEnvironment: environment,
            userId: user.id,
            causeId: 'w3ZvQrMnB',
            redirect: '',
          })

          break

        // Default do nothing
        default:
          break
      }
    }

    // Log or use the received message
    // console.log('Received message from child:', event.data, event.origin)
  }

  // Set up the event listener
  // eslint-disable-next-line no-undef
  window.addEventListener(
    'message',
    event => {
      receiveMessage(event, slot)
    },
    false
  )

  return (
    <>
      {show && (slot === 'top-right' || slot === 'top-center') && (
        <iframe
          id={`notification-${slot}`}
          src={`${
            process.env.REACT_APP_API_ENDPOINT
          }/v5/notifications?user_id=${user.userId}&slot=${slot}&override=${
            sParams.NotificationOverride
          }&version=${sParams.Version}`}
          title={`notification-${slot}`}
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            backgroundColor: 'white',
            zIndex: 100000000,
          }}
          width="100%"
          height={height}
          frameBorder="0"
        />
      )}

      {slot === 'modal-center' && (
        <iframe
          id={`notification-hidden-${slot}`}
          src={`${
            process.env.REACT_APP_API_ENDPOINT
          }/v5/notifications?user_id=${user.userId}&slot=${slot}&override=${
            sParams.NotificationOverride
          }&version=${sParams.Version}`}
          title={`notification-hidden-${slot}`}
          style={{ marginTop: '10px', marginBottom: '10px' }}
          frameBorder="0"
        />
      )}

      {showModal && slot === 'modal-center' && (
        <Modal
          id={`notification-modal-${slot}`}
          open={showModal}
          style={{
            height: height + 30,
            marginTop: 'auto',
            marginBottom: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 900,
            position: 'absolute',
            backgroundColor: '#fff',
            zIndex: 100000000,
          }}
        >
          <div style={{ height: '100%' }}>
            <div
              style={{
                height: '100%',
                width: '100%',
                padding: 0,
                backgroundColor: 'white',
                display: 'flex',
                flexFlow: 'column',
              }}
            >
              <iframe
                id={`notification-${slot}`}
                src={`${
                  process.env.REACT_APP_API_ENDPOINT
                }/v5/notifications?user_id=${
                  user.userId
                }&slot=${slot}&override=${
                  sParams.NotificationOverride
                }&version=${sParams.Version}`}
                title={`notification-${slot}`}
                width="100%"
                height="100%"
                frameBorder="0"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Used for top-center modal windows */}
      {iframeUrl && openWidget && (
        <Modal
          id={`notification-modal-${slot}`}
          open={openWidget}
          style={{
            top: 10,
            left: 0,
            right: 0,
            bottom: 100,
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 800,
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 100000000,
          }}
        >
          <div style={{ height: '100%' }}>
            <IconButton
              onClick={onClose}
              style={{ position: 'absolute', right: 0, top: 5 }}
            >
              <CloseIcon sx={{ color: '#fff', width: 28, height: 28 }} />
            </IconButton>

            <div
              style={{
                height: '100%',
                width: '100%',
                padding: 5,
                paddingTop: 20,
                paddingBottom: 20,
                backgroundColor: 'white',
                display: 'flex',
                flexFlow: 'column',
              }}
            >
              <iframe
                style={{ border: 'none', flex: '1 1 auto' }}
                id={`notification-widget-${slot}`}
                title={`notification-widget-${slot}`}
                src={iframeUrl}
                width="100%"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

Notification.displayName = 'NotificationComponent'

Notification.propTypes = {
  slot: PropTypes.string.isRequired,

  user: PropTypes.shape({
    userId: PropTypes.string,
  }).isRequired,

  onOpenLeaderboard: PropTypes.func,
}

Notification.defaultProps = {
  onOpenLeaderboard: null,
}

export default Notification
