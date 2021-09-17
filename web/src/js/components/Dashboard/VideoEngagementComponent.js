import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ButtonBase from '@material-ui/core/ButtonBase'
import MovieFilterIcon from '@material-ui/icons/MovieFilter'
import Dialog from '@material-ui/core/Dialog'
import useTrueX, { CLOSED } from 'js/utils/useTrueX'

const VideoEngagementComponent = ({ iconProps }) => {
  const [isAdOpen, setIsAdOpen] = useState(false)
  const [adContainerElem, setAdContainerElem] = useState(null)

  const trueX = useTrueX({
    open: isAdOpen,
    adContainer: adContainerElem,
  })
  console.log('true[X]', trueX)
  const { adAvailable, status } = trueX

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
      <Dialog open={isAdOpen} onClose={closeModal} maxWidth={false}>
        <div ref={newRef => setAdContainerElem(newRef)} />
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
