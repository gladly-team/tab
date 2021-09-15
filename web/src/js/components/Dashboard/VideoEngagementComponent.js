import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import ButtonBase from '@material-ui/core/ButtonBase'
import MovieFilterIcon from '@material-ui/icons/MovieFilter'
import Dialog from '@material-ui/core/Dialog'
import useTrueX from 'js/utils/useTrueX'

const VideoEngagementComponent = ({ iconProps }) => {
  const [isAdAvailable, setIsAdAvailable] = useState(false)
  const [isAdOpen, setIsAdOpen] = useState(false)

  const [adContainerElem, setAdContainerElem] = useState(null)

  const config = useMemo(
    () => ({
      open: isAdOpen,
      adContainer: adContainerElem,
      onAdAvailable: () => {
        setIsAdAvailable(true)
      },
      // onStart = () => {},
      onClose: () => {
        setIsAdOpen(false)
      },
      // onFinish: () => {},
    }),
    [isAdOpen, adContainerElem]
  )
  useTrueX(config)

  const openAd = () => {
    if (!isAdAvailable) {
      console.log('No ad. Cannot open anything.')
      return
    }
    setIsAdOpen(true)
  }

  const onModalClose = () => {
    setIsAdOpen(false)
  }

  return (
    <div>
      <ButtonBase onClick={openAd}>
        <MovieFilterIcon
          {...iconProps}
          style={{
            color: isAdAvailable ? 'gold' : 'inherit',
          }}
        />
      </ButtonBase>
      <Dialog open={isAdOpen} onClose={onModalClose} fullWidth maxWidth={false}>
        <div
          ref={newRef => setAdContainerElem(newRef)}
          style={{ width: '100vw', height: '100vh' }}
        />
      </Dialog>
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

export default VideoEngagementComponent
