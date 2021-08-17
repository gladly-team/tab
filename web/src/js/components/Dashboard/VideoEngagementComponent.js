import React from 'react'
import PropTypes from 'prop-types'
import ButtonBase from '@material-ui/core/ButtonBase'
import MovieFilterIcon from '@material-ui/icons/MovieFilter'

const VideoEngagementComponent = ({ iconProps }) => {
  return (
    <div>
      <ButtonBase>
        <MovieFilterIcon {...iconProps} />
      </ButtonBase>
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
