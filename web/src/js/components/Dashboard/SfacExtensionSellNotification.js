import React, { useCallback, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import CreateSfacExtensionPromptResponseMutation from 'js/mutations/CreateSfacExtensionPromptResponseMutation'
import awaitTimeLimit from 'js/utils/awaitTimeLimit'
import { getSearchExtensionPage, replaceUrl } from 'js/navigation/navigation'
import { AwaitedPromiseTimeout } from 'js/utils/errors'
import logger from 'js/utils/logger'
import Notification from 'js/components/Dashboard/NotificationV2'
import { withStyles } from '@material-ui/core/styles'
import useDoesBrowserSupportSearchExtension from 'js/utils/hooks/useDoesBrowserSupportSearchExtension'
import useBrowserName from 'js/utils/hooks/useBrowserName'

const styles = theme => ({
  noButton: {
    height: '30px',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  yesButton: {
    background: '#29BEBA',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '900',
    fontFamily: 'Poppins',
    marginLeft: '6',
    color: 'white',
  },
  title: {
    fontWeight: '700',
    fontSize: '24px',
    fontFamily: 'Poppins',
  },
  text: {
    paddingBottom: 20,
    maxWidth: 350,
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
})

const SfacExtensionSellNotification = ({
  classes,
  userId,
  showSfacExtensionPrompt,
}) => {
  const [open, setOpen] = useState(false)
  const [browser, setBrowser] = useState(null)
  const browserName = useBrowserName()
  const searchExtensionSupported = useDoesBrowserSupportSearchExtension()
  useEffect(() => {
    if (searchExtensionSupported) {
      setOpen(showSfacExtensionPrompt)
    }
    setBrowser(browserName)
  }, [searchExtensionSupported, showSfacExtensionPrompt])

  const onYesClick = useCallback(async () => {
    // Log the search event but time-cap how long we wait to avoid a bad UX
    // if the request hangs.
    try {
      const MS_TO_WAIT_FOR_LOG = 1500
      await awaitTimeLimit(
        CreateSfacExtensionPromptResponseMutation(userId, browser, true),
        MS_TO_WAIT_FOR_LOG
      )
    } catch (e) {
      if (e.code !== AwaitedPromiseTimeout.code) {
        logger.error(e)
      }
    }
    setOpen(false)
    replaceUrl(getSearchExtensionPage)
  }, [userId, browser])
  const onNoClick = () => {
    CreateSfacExtensionPromptResponseMutation(userId, browser, false)
    setOpen(false)
  }
  return (
    <div className={classes.wrapper}>
      <Notification
        open={open}
        text={
          <span className={classes.text}>
            <Typography className={classes.title}>
              Make a bigger impact
            </Typography>
            <Typography variant="body1">
              Turn your searches into money for causes with Search for a Cause.
              Like tabbing, it’s free and easy!
            </Typography>
          </span>
        }
        buttons={
          <div className={classes.buttonsWrapper}>
            <Button onClick={onNoClick} className={classes.noButton}>
              Maybe later
            </Button>
            <Button
              onClick={onYesClick}
              className={classes.yesButton}
              variant="contained"
            >
              Let's do it!
            </Button>
          </div>
        }
      />
    </div>
  )
}

SfacExtensionSellNotification.propTypes = {
  userId: PropTypes.string,
  showSfacExtensionPrompt: PropTypes.bool.isRequired,
}

SfacExtensionSellNotification.defaultProps = {
  userId: PropTypes.string,
}

export default withStyles(styles)(SfacExtensionSellNotification)
