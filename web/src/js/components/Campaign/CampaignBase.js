
import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import {
  alternateAccentColor
} from 'js/theme/default'
import StickerCampaign from 'js/components/Campaign/StickerCampaignContainer'

class CampaignBase extends React.Component {
  render () {
    const {
      isCampaignLive
      // user
    } = this.props
    if (!isCampaignLive) {
      return null
    }
    const rootStyle = {
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      pointerEvents: 'none'
    }
    const campaignContainerStyle = {
      pointerEvents: 'all',
      width: 400,
      margin: 0,
      marginBottom: 100,
      padding: 0,
      background: '#FFF',
      border: 'none'
    }
    const headerLineStyle = {
      width: '100%',
      height: 3,
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
      backgroundColor: alternateAccentColor
    }

    // Hardcode campaign component here when running one
    const currentCampaign = (
      <StickerCampaign user={this.props.user} />
    )

    if (!currentCampaign) {
      return (
        <span
          style={{ display: 'none' }}
          data-test-id={'campaign-root'}
        />
      )
    }

    return (
      <div
        style={rootStyle}
        data-test-id={'campaign-root'}
      >
        <Paper
          zDepth={1}
          style={campaignContainerStyle}
        >
          <div style={headerLineStyle} />
          {currentCampaign}
        </Paper>
      </div>
    )
  }
}

CampaignBase.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  isCampaignLive: PropTypes.bool
}

CampaignBase.defaultProps = {
  isCampaignLive: false
}

export default CampaignBase
