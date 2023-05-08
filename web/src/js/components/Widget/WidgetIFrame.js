import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const WidgetIFame = ({ url, onClose, widgetName }) => {
  //const [open, setOpen] = React.useState(true)

  const onCloseWidget = () => {
    onClose()
  }

  return (
    <Modal
      open={true}
      onClose={onCloseWidget}
      style={{
        top: 20,
        left: 40,
        right: 40,
        bottom: 20,
        position: 'absolute',
        backgroundColor: 'transparent',
      }}
    >
      <div style={{ height: '100%' }}>
        <IconButton
          onClick={onClose}
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
