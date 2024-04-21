'use client'

import React, { useState } from 'react'
import PropTypes from 'prop-types'

const isBrowser = typeof window !== 'undefined'

const sParams = {
  NotificationOverride: null,
}

if (isBrowser) {
  // eslint-disable-next-line no-undef
  const p = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  sParams.NotificationOverride = p['notification-override'] || ''
}

// Example Overrides: ?notification-override=leaderboard-change-flat
// Example Overrides: ?notification-override=leaderboard-change-down
// Example Overrides: ?notification-override=leaderboard-change-up
const Notification = ({ slot, user, onOpenLeaderboard }) => {
  const [show, setShow] = useState(true)
  const [height, setHeight] = useState(0)

  // User is not loaded yet.
  if (!user) {
    return null
  }

  if (typeof window === 'undefined') {
    return null
  }

  // Function to handle received messages
  function receiveMessage(event) {
    // TODO(spicer): Add origin check for added security
    // if (event.origin !== 'http://127.0.0.1:9000') return

    // Check if the message is for us. If not, ignore it.
    if (typeof event.data.show === 'undefined') return

    // Do we want to show the notification?
    if (event.data.show) {
      setShow(true)
      setHeight(event.data.height)
    } else {
      setShow(false)
      setHeight(0)
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
  window.addEventListener('message', receiveMessage, false)

  return (
    <>
      {show && (
        <iframe
          src={`${
            process.env.REACT_APP_API_ENDPOINT
          }/newtab/notifications?user_id=${user.userId}&slot=${slot}&override=${
            sParams.NotificationOverride
          }`}
          title={`notification-${slot}`}
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            backgroundColor: 'white',
          }}
          width="100%"
          height={height}
          frameBorder="0"
        />
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
