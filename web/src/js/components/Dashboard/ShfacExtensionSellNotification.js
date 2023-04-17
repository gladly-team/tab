import React, { useCallback, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import Link from 'js/components/General/Link'
import { Typography } from '@material-ui/core'
// import CreateSfacExtensionPromptResponseMutation from 'js/mutations/CreateSfacExtensionPromptResponseMutation'
// import awaitTimeLimit from 'js/utils/awaitTimeLimit'
import {
  shopChromeExtensionPage,
  shopEdgeExtensionPage,
  getShopExtensionPage,
  replaceUrl,
} from 'js/navigation/navigation'
// import { AwaitedPromiseTimeout } from 'js/utils/errors'
// import logger from 'js/utils/logger'
import Notification from 'js/components/Dashboard/NotificationV2'
import { withStyles } from '@material-ui/core/styles'
import useDoesBrowserSupportShopExtension from 'js/utils/hooks/useDoesBrowserSupportShopExtension'
import useBrowserName from 'js/utils/hooks/useBrowserName'
import localStorageMgr from 'js/utils/localstorage-mgr'

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
    paddingBottom: 8,
  },
  text: {
    maxWidth: 350,
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  wrapper: {
    maxWidth: '400px',
    marginTop: '4px',
  },
  notification: {
    padding: 12,
  },
  subtitle: {
    paddingBottom: 16,
  },
})

const ShfacExtensionSellNotification = ({ classes, userId, variation }) => {
  const [open, setOpen] = useState(false)
  const [browser, setBrowser] = useState(null)
  const browserName = useBrowserName()
  const shopExtensionSupported = useDoesBrowserSupportShopExtension()

  useEffect(() => {
    if (browserName) {
      const capitalized =
        browserName.charAt(0).toUpperCase() + browserName.slice(1)
      setBrowser(capitalized)
    }

    setOpen(shopExtensionSupported)
  }, [shopExtensionSupported, browserName])

  const setDismissed = () => {
    const CODE = 'shfac-notify-launch'
    const NOTIF_DISMISS_PREFIX = 'tab.user.dismissedNotif'
    localStorageMgr.setItem(`${NOTIF_DISMISS_PREFIX}.${CODE}`, 'true')
  }

  const onYesClick = useCallback(async () => {
    setDismissed()

    if (variation == 'Version1' || variation == 'Version3') {
      replaceUrl(getShopExtensionPage)
    } else {
      if (browser == 'Chrome') {
        replaceUrl(shopChromeExtensionPage)
      } else if (browser == 'Edge') {
        replaceUrl(shopEdgeExtensionPage)
      } else {
        // Default should it not detect browser (not likely)
        replaceUrl(getShopExtensionPage)
      }
    }
  }, [userId, browser])

  const onNoClick = () => {
    setDismissed()
    setOpen(false)
  }

  return (
    <>
      {variation == 'Version1' ? (
        <div className={classes.wrapper}>
          <Notification
            className={classes.notification}
            open={open}
            text={
              <span className={classes.text}>
                <Typography className={classes.title}>
                  Introducing: Shop for a Cause
                </Typography>
                <Typography className={classes.subtitle} variant="body1">
                  We are excited to officially launch{' '}
                  <Link
                    to={getShopExtensionPage}
                    target="_blank"
                    style={{ color: '#9d4ba3' }}
                  >
                    Shop for a Cause
                  </Link>
                  ! Now, you can raise even more money for charity when you shop
                  online. Like Tab for a Cause, it is simple, free, and
                  impactful. It takes 10 seconds to get started, try it out
                  today!
                </Typography>
              </span>
            }
            buttons={
              <div className={classes.buttonsWrapper}>
                <Button onClick={onNoClick} className={classes.noButton}>
                  Maybe later
                </Button>
                {browser ? (
                  <Button
                    onClick={onYesClick}
                    className={classes.yesButton}
                    variant="contained"
                  >
                    Add to {browser}
                  </Button>
                ) : null}
              </div>
            }
          />
        </div>
      ) : null}

      {variation == 'Version2' ? (
        <div className={classes.wrapper}>
          <Notification
            className={classes.notification}
            open={open}
            text={
              <span className={classes.text}>
                <Typography className={classes.title}>
                  Introducing: Shop for a Cause
                </Typography>
                <Typography className={classes.subtitle} variant={'body1'}>
                  We are excited to officially launch{' '}
                  <Link
                    to={getShopExtensionPage}
                    target="_blank"
                    style={{ color: '#9d4ba3' }}
                  >
                    Shop for a Cause
                  </Link>
                  ! Now, you can raise even more money for charity when you shop
                  online. Like Tab for a Cause, it is simple, free, and
                  impactful. It takes 10 seconds to get started, try it out
                  today!
                </Typography>
              </span>
            }
            buttons={
              <div className={classes.buttonsWrapper}>
                <Button onClick={onNoClick} className={classes.noButton}>
                  Maybe later
                </Button>
                {browser ? (
                  <Button
                    onClick={onYesClick}
                    className={classes.yesButton}
                    variant="contained"
                  >
                    Add to {browser}
                  </Button>
                ) : null}
              </div>
            }
          />
        </div>
      ) : null}

      {variation == 'Version3' ? (
        <div className={classes.wrapper}>
          <Notification
            className={classes.notification}
            open={open}
            text={
              <span className={classes.text}>
                <Typography className={classes.title}>
                  Shop for a Cause
                </Typography>
                <Typography className={classes.subtitle} variant={'body1'}>
                  When Amazon{' '}
                  <Link
                    to={
                      'https://www.npr.org/2023/01/19/1149993013/amazon-amazonsmile-charity-donation-program'
                    }
                    target="_blank"
                    style={{ color: '#9d4ba3' }}
                  >
                    shutdown their Smile program
                  </Link>{' '}
                  to focus on more profit, it was a huge loss to charities. In
                  response, we are proud to present{' '}
                  <Link
                    to={getShopExtensionPage}
                    target="_blank"
                    style={{ color: '#9d4ba3' }}
                  >
                    Shop for a Cause
                  </Link>
                  , our newest extension that raises money for charity as you
                  shop online at over 10,000 partner stores. It is simple, free,
                  and impactful &hearts;.
                </Typography>
              </span>
            }
            buttons={
              <div className={classes.buttonsWrapper}>
                <Button onClick={onNoClick} className={classes.noButton}>
                  Maybe later
                </Button>
                {browser ? (
                  <Button
                    onClick={onYesClick}
                    className={classes.yesButton}
                    variant="contained"
                  >
                    Add to {browser}
                  </Button>
                ) : null}
              </div>
            }
          />
        </div>
      ) : null}
    </>
  )
}

ShfacExtensionSellNotification.propTypes = {
  userId: PropTypes.string,
  variation: PropTypes.string.isRequired,
}

ShfacExtensionSellNotification.defaultProps = {
  userId: PropTypes.string,
}

export default withStyles(styles)(ShfacExtensionSellNotification)
