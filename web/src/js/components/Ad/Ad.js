
import React from 'react'
import PropTypes from 'prop-types'
import displayAd from 'ads/displayAd'

// Suggestions on React component using DFP:
// https://stackoverflow.com/q/25435066/1332513
class Ad extends React.Component {
  componentDidMount () {
    displayAd(this.props.adId)
  }

  render () {
    const adStyle = Object.assign(
      {},
      this.props.style,
      {width: this.props.width, height: this.props.height}
    )
    return (
      <div style={adStyle}>
        <div id={this.props.adId} />
      </div>
    )
  }
}

Ad.propTypes = {
  adId: PropTypes.string,
  adSlotId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object
}

Ad.defaultProps = {
  style: {}
}

export default Ad
