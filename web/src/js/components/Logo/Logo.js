
import React from 'react'
import PropTypes from 'prop-types'
import logoDefault from 'js/assets/logos/logo.svg'
import logoWhite from 'js/assets/logos/logo-white.svg'

class LogoWithText extends React.Component {
  render () {
    const { color, style } = this.props
    const finalStyle = Object.assign({}, {
      height: 40
    }, style)
    const logo = color === 'purple' ? logoDefault : logoWhite
    return (
      <img style={finalStyle} src={logo} alt='Tab for a Cause logo' />
    )
  }
}

LogoWithText.props = {
  style: PropTypes.object,
  color: PropTypes.oneOf(['purple', 'white'])
}

LogoWithText.defaultProps = {
  style: {},
  color: 'purple'
}

export default LogoWithText
