
import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import {
  alternateAccentColor
} from 'theme/default'

class CampaignBase extends React.Component {
  render () {
    if (!this.props.isCampaignLive) {
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
      width: 400,
      height: 300,
      margin: 0,
      marginBottom: 60,
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
          <div>TODO: campaign goes here</div>
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

CampaignBase.defautProps = {
  isCampaignLive: false
}

export default CampaignBase
