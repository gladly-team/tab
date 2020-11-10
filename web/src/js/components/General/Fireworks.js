import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as FireworksCanvas from 'fireworks-canvas'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const styles = {
  container: {
    position: 'fixed',
    zIndex: 5000,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.85)',
  },
  closeIconButton: {
    position: 'absolute',
    zIndex: 6000,
    top: 10,
    right: 10,
  },
  closeIcon: {
    color: 'rgba(255, 255, 255, 0.8)',
    width: 36,
    height: 36,
  },
}

const Fireworks = ({ classes, children, onClose, options }) => {
  const containerEl = useRef(null)
  useEffect(() => {
    const fireworks = new FireworksCanvas(containerEl.current, options)
    const stopFireworks = fireworks.start()
    return stopFireworks
  }, [containerEl, options])
  return (
    <div ref={containerEl} className={classes.container}>
      <IconButton
        className={classes.closeIconButton}
        onClick={() => {
          onClose()
        }}
      >
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
      {children}
    </div>
  )
}

Fireworks.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClose: PropTypes.func.isRequired,
  options: PropTypes.object,
}

Fireworks.defaultProps = {
  onClose: () => {},
}

export default withStyles(styles)(Fireworks)
