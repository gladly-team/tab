import React, { useRef, useState } from 'react'
import * as FireworksCanvas from 'fireworks-canvas'
import { withStyles } from '@material-ui/core/styles'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const styles = {
  container: {
    position: 'absolute',
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

const Fireworks = ({ classes, children, options }) => {
  const [active, setActive] = useState(true)
  const containerEl = useRef(null)
  if (containerEl.current) {
    const fireworks = new FireworksCanvas(containerEl.current, options)
    fireworks.start()
  }
  return (
    <FadeInDashboardAnimation>
      {active ? (
        <div ref={containerEl} className={classes.container}>
          <IconButton
            className={classes.closeIconButton}
            onClick={() => {
              setActive(false)
            }}
          >
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
          {children}
        </div>
      ) : null}
    </FadeInDashboardAnimation>
  )
}

export default withStyles(styles)(Fireworks)
