import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import MovieFilterIcon from '@material-ui/icons/MovieFilter'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import useTrueX, { CLOSED } from 'js/utils/useTrueX'

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
    marginTop: 16,
  },
})

const VideoEngagementComponent = ({ classes, iconProps }) => {
  const [isAdOpen, setIsAdOpen] = useState(false)
  const [adContainerElem, setAdContainerElem] = useState(null)

  const trueX = useTrueX({
    open: isAdOpen,
    adContainer: adContainerElem,
  })
  console.log('true[X]', trueX)
  const { adAvailable, credited, status } = trueX

  const openAd = () => {
    if (!adAvailable) {
      console.log('No ad. Cannot open anything.')
      return
    }
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
      <ButtonBase onClick={openAd}>
        <MovieFilterIcon
          {...iconProps}
          style={{
            color: adAvailable ? 'gold' : 'inherit',
          }}
        />
      </ButtonBase>
      <Modal open={isAdOpen} onClose={closeModal}>
        <div className={classes.modalContent}>
          <IconButton className={classes.closeIconButton} onClick={closeModal}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
          <div className={classes.messageContainer}>
            {credited ? (
              <Typography variant={'body2'}>
                You just earned 100 Hearts! Thank you!
              </Typography>
            ) : (
              <Typography variant={'body2'}>
                Complete this ad to earn 100 Hearts.
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
