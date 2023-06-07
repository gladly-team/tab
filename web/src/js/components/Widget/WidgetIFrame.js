import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import localStorageMgr from 'js/utils/localstorage-mgr'

const dismissBase = 'tab.user.dismissedNotif.'

const marginStyle = {
  top: 20,
  left: 40,
  right: 40,
  bottom: 20,
  position: 'absolute',
  backgroundColor: 'transparent',
}

const fullScreenStyle = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  position: 'absolute',
  backgroundColor: 'transparent',
}

const WidgetIFame = ({ url, onClose, widgetName }) => {
  // On close
  const onCloseWidget = () => {
    localStorageMgr.setItem(dismissBase + widgetName, 'true')
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

  // Don't show if user has dismissed it
  if (localStorageMgr.getItem(dismissBase + widgetName) === 'true') {
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

        <iframe title="Widget Content" src={url} width="100%" height="100%" />
      </div>
    </Modal>
  )
}

WidgetIFame.propTypes = {
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  widgetName: PropTypes.string.isRequired,
}

export default WidgetIFame
