import React, { useRef } from 'react'
import * as FireworksCanvas from 'fireworks-canvas'
import { withStyles } from '@material-ui/core/styles'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'

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
}

const Fireworks = ({ classes, children, options }) => {
  const containerEl = useRef(null)
  if (containerEl.current) {
    const fireworks = new FireworksCanvas(containerEl.current, options)
    fireworks.start()
  }
  return (
    <FadeInDashboardAnimation>
      <div ref={containerEl} className={classes.container}>
        {children}
      </div>
    </FadeInDashboardAnimation>
  )
}

export default withStyles(styles)(Fireworks)
