import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const fullScreenStyle = {
  top: 10,
  left: 0,
  right: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: 800,
  bottom: 10,
  position: 'absolute',
  backgroundColor: 'white',
  zIndex: 100000000,
}

const iframeURL =
  'https://snowy-stream-wljibw2liswn.vapor-farm-g1.com/newtab/leaderboard?user_id='

const Leaderboard = ({ user, onClose }) => {
  // On close
  const onCloseWidget = () => {
    onClose()
  }

  // This hook is listening an event that came from the Iframe
  useEffect(() => {
    // iframe message handler.
    const handler = ev => {
      if (ev.data !== 'close') return
      onCloseWidget()
    }
    // eslint-disable-next-line no-undef
    window.addEventListener('message', handler)
    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('message', handler)
  }, [onCloseWidget])

  if (!user) {
    return null
  }

  return (
    <Modal open={true} onClose={onCloseWidget} style={fullScreenStyle}>
      <div style={{ height: '100%' }}>
        <IconButton
          onClick={onCloseWidget}
          style={{ position: 'absolute', right: 25, top: 5 }}
        >
          <CloseIcon sx={{ color: '#fff', width: 28, height: 28 }} />
        </IconButton>

        <iframe
          style={{ border: 'none', flex: '1 1 auto', backgroundColor: 'white' }}
          id="leaderboard-iframe"
          title="Leaderboard Widget"
          src={iframeURL + user.userId}
          width="100%"
          height="100%"
        />
      </div>
    </Modal>
  )
}

Leaderboard.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Leaderboard
