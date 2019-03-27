import React from 'react'
import PropTypes from 'prop-types'
import tabLogoDefault from 'js/assets/logos/logo.svg'
import tabLogoWhite from 'js/assets/logos/logo-white.svg'
import tabLogoWithText from 'js/assets/logos/logo-with-text.svg'

// TODO: incorporate LogoWithText and search logo into this component
class Logo extends React.Component {
  render() {
    const { color, includeText, style } = this.props
    const finalStyle = Object.assign(
      {},
      {
        height: 40,
      },
      style
    )
    const logo = includeText
      ? tabLogoWithText
      : color === 'purple'
      ? tabLogoDefault
      : tabLogoWhite
    return <img style={finalStyle} src={logo} alt="Tab for a Cause logo" />
  }
}

Logo.props = {
  includeText: PropTypes.bool.isRequired,
  style: PropTypes.object,
  color: PropTypes.oneOf(['purple', 'white']),
}

Logo.defaultProps = {
  includeText: false,
  style: {},
  color: 'purple',
}

export default Logo
