import React from 'react'
import PropTypes from 'prop-types'
import logoDefault from 'js/assets/logos/logo.svg'
import logoWhite from 'js/assets/logos/logo-white.svg'

// TODO: incorporate LogoWithText and search logo into this component
class Logo extends React.Component {
  render() {
    const { color, style } = this.props
    const finalStyle = Object.assign(
      {},
      {
        height: 40,
      },
      style
    )
    const logo = color === 'purple' ? logoDefault : logoWhite
    return <img style={finalStyle} src={logo} alt="Tab for a Cause logo" />
  }
}

Logo.props = {
  style: PropTypes.object,
  color: PropTypes.oneOf(['purple', 'white']),
}

Logo.defaultProps = {
  style: {},
  color: 'purple',
}

export default Logo
