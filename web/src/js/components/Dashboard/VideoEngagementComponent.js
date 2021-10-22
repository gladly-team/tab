import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Modal from '@material-ui/core/Modal'
import Badge from '@material-ui/core/Badge'
import Typography from '@material-ui/core/Typography'
import useTrueX, { CLOSED } from 'js/utils/useTrueX'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo'
const styles = theme => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
  },
  closeIconButton: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  closeIcon: {
    color: 'rgba(255, 255, 255, 0.8)',
    width: 36,
    height: 36,
  },
  messageContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 24,
  },
  adContainer: {
    margin: 'auto',
    marginTop: 8,
  },
  badgeRoot: { top: '3px' },
})

const VideoEngagementComponent = ({
  user: { id, truexId, videoAdEligible },
  classes,
  iconProps,
}) => {
  const [isAdOpen, setIsAdOpen] = useState(false)
  const [adContainerElem, setAdContainerElem] = useState(null)
  const [isPoppoverOpen, setIsPoppoverOpen] = useState(false)
  const poppoverRef = useRef()

  // Note that true[X] appears to rate-limit a user ID even
  // in the test environment, so change this if you're not seeing
  // any ad availability.
  const trueX = useTrueX({
    open: isAdOpen,
    adContainer: adContainerElem,
    truexUserId: truexId,
    userId: id,
    videoAdEligible,
  })
  const { adAvailable, credited, status, error } = trueX
  const showAd = videoAdEligible && adAvailable
  const openAd = () => {
    setIsAdOpen(true)
  }

  const closeModal = () => {
    setIsAdOpen(false)
  }

  // If true[X] triggers a close, then close our modal.
  useEffect(() => {
    if (status === CLOSED) {
      closeModal()
    }
  }, [status])
  return (
    <div>
      <div
        ref={poppoverRef}
        onClick={showAd ? undefined : () => setIsPoppoverOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <ButtonBase
          onClick={openAd}
          disabled={!showAd}
          onMouseEnter={showAd ? () => setIsPoppoverOpen(true) : undefined}
          onMouseLeave={() => setIsPoppoverOpen(false)}
        >
          <Badge
            variant="dot"
            color="primary"
            classes={{ badge: classes.badgeRoot }}
            invisible={!showAd}
          >
            <OndemandVideoIcon
              style={{ opacity: showAd ? 1 : 0.54 }}
              {...iconProps}
            />
          </Badge>
        </ButtonBase>
      </div>
      <DashboardPopover
        style={{
          pointerEvents: showAd ? 'none' : undefined,
          marginTop: 6,
        }}
        anchorEl={poppoverRef.current}
        onClose={
          showAd
            ? () => {
                setIsPoppoverOpen(false)
                openAd()
              }
            : () => setIsPoppoverOpen(false)
        }
        open={isPoppoverOpen}
      >
        <div
          style={{
            padding: 10,
            width: 268,
          }}
        >
          <Typography
            variant={'body1'}
            style={{ color: '#fff', marginBottom: '10px' }}
          >
            Watch a video, earn 100 hearts!
          </Typography>
          {showAd ? (
            <>
              <Typography variant={'body2'} gutterBottom>
                An easy way to do more good!
              </Typography>
              <Typography variant={'body2'} gutterBottom>
                You’ll earn 100 hearts and raise more money for charity.
              </Typography>
            </>
          ) : (
            <Typography variant="body2">
              No videos available right now, but we’ll let you know when one is.
            </Typography>
          )}
        </div>
      </DashboardPopover>
      <Modal open={isAdOpen} onClose={closeModal}>
        <div className={classes.modalContent}>
          <IconButton className={classes.closeIconButton} onClick={closeModal}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
          <div className={classes.messageContainer}>
            {!error && credited && (
              <Typography variant={'body2'}>
                You’ve earned 100 hearts! Congrats, and thanks!
              </Typography>
            )}
            {!error && !credited && (
              <Typography variant={'body2'}>
                Complete and interact with this video to earn 100 hearts!
              </Typography>
            )}
            {error && (
              <Typography variant={'body2'}>
                I’m sorry, something went wrong: we failed to give you 100
                hearts.
              </Typography>
            )}
          </div>
          <div className={classes.adContainer}>
            <div ref={newRef => setAdContainerElem(newRef)} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

VideoEngagementComponent.displayName = 'VideoEngagementComponent'

VideoEngagementComponent.propTypes = {
  iconProps: PropTypes.object,
}

VideoEngagementComponent.defaultProps = {
  iconProps: {},
}

export default withStyles(styles, { withTheme: true })(VideoEngagementComponent)
