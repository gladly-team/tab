import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as FireworksCanvas from 'fireworks-canvas'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import SocialShare from 'js/components/General/SocialShareComponent'
import { millionRaisedURL } from 'js/navigation/navigation'

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
  messageContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    maxWidth: 800,
  },
  messageText: {
    color: 'white',
  },
  shareContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  shareMessageText: {
    color: 'white',
    marginRight: 12,
  },
}

const FireworksMessage1MComponent = ({ classes }) => {
  return (
    <div className={classes.messageContainer}>
      <Typography variant="h2" className={classes.messageText} gutterBottom>
        Congratulations!
      </Typography>
      <Typography variant="h5" className={classes.messageText} gutterBottom>
        This is an incredible milestone, and we couldn't be more proud of the
        Tabbing community. From the bottoms of our hearts, thank you.
      </Typography>
      <div className={classes.shareContainer}>
        <Typography
          variant="h5"
          className={classes.shareMessageText}
          gutterBottom
        >
          Share this achievement:
        </Typography>
        <SocialShare
          url={millionRaisedURL}
          FacebookShareButtonProps={
            {
              // Disabling the quote so Facebook shares the large version
              // of the image, but leaving this prop so that SocialShare
              // will still show the Facebook button.
              // quote:
              //   'Join me in turning your internet browsing into a force for good with @TabForACause',
            }
          }
          RedditShareButtonProps={{
            title:
              'Turn your internet browsing into a force for good with Tab for a Cause',
          }}
          TumblrShareButtonProps={{
            title: 'A simple and free way to make the world a better place',
            caption:
              'Turn your internet browsing into a force for good with Tab for a Cause',
          }}
          TwitterShareButtonProps={{
            title:
              'Turn your internet browsing into a force for good with @TabForACause. Join me! #TabForAMillion',
            related: ['@TabForACause'],
          }}
        />
      </div>
    </div>
  )
}
FireworksMessage1MComponent.propTypes = {
  classes: PropTypes.object.isRequired,
}
FireworksMessage1MComponent.defaultProps = {
  classes: {},
}
export const FireworksMessage1M = withStyles(styles)(
  FireworksMessage1MComponent
)

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
