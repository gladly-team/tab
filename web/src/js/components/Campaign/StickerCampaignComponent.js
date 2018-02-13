
import React from 'react'
import PropTypes from 'prop-types'

class StickerCampaign extends React.Component {
  render () {
    const { user } = this.props
    return (
      <div>
        <div>Stats:</div>
        <div>Users recruited: {user.recruits.totalRecruits}</div>
        <div>Confirmed recruits: {user.recruits.recruitsActiveForAtLeastOneDay}</div>
      </div>
    )
  }
}

StickerCampaign.propTypes = {
  user: PropTypes.shape({
    recruits: PropTypes.shape({
      edges: PropTypes.array.isRequired,
      totalRecruits: PropTypes.number,
      recruitsActiveForAtLeastOneDay: PropTypes.number
    }).isRequired
  }),
  isCampaignLive: PropTypes.bool
}

StickerCampaign.defautProps = {
  isCampaignLive: false
}

export default StickerCampaign
