
import React from 'react'
import PropTypes from 'prop-types'
import displayAd from 'js/ads/displayAd'

// Suggestions on React component using DFP:
// https://stackoverflow.com/q/25435066/1332513
class Ad extends React.Component {
  componentDidMount () {
    displayAd(this.props.adId)
  }

  // Never update. This prevents unexpected unmounting or
  // rerendering of third-party ad content.
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }

  render () {
    const adStyle = Object.assign(
      {}, this.props.style)
    const adContainerStyle = Object.assign(
      {}, this.props.adWrapperStyle)
    return (
      <div style={adStyle}>
        <div id={this.props.adId} style={adContainerStyle} />
      </div>
    )
  }
}

Ad.propTypes = {
  adId: PropTypes.string,
  style: PropTypes.object,
  adWrapperStyle: PropTypes.object
}

Ad.defaultProps = {
  style: {},
  adWrapperStyle: {}
}

export default Ad
