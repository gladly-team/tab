import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import ButtonBase from '@material-ui/core/ButtonBase'
import MovieFilterIcon from '@material-ui/icons/MovieFilter'
// import Dialog from '@material-ui/core/Dialog'
import useTrueX from 'js/utils/useTrueX'

const VideoEngagementComponent = ({ iconProps }) => {
  const [isAdAvailable, setIsAdAvailable] = useState(false)
  const [isAdOpen, setIsAdOpen] = useState(false)

  const config = useMemo(
    () => ({
      open: isAdOpen,
      adContainer: null, // TODO
      onAdAvailable: () => {
        setIsAdAvailable(true)
      },
      // onStart = () => {},
      onClose: () => {
        setIsAdOpen(false)
      },
      // onFinish: () => {},
    }),
    [isAdOpen]
  )
  useTrueX(config)

  const openAd = () => {
    if (!isAdAvailable) {
      console.log('No ad. Cannot open anything.')
      return
    }
    setIsAdOpen(true)
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
      {isAdOpen ? <div>TODO</div> : null}
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
