
import React from 'react'
import PropTypes from 'prop-types'
import logoWithText from 'js/assets/logos/logo-with-text.svg'

class LogoWithText extends React.Component {
  render () {
    const style = Object.assign({}, {
      height: 40
    }, this.props.style)
    return (
      <img style={style} src={logoWithText} />
    )
  }
}

LogoWithText.props = {
  style: PropTypes.object
}

LogoWithText.defaultProps = {
  style: {}
}

export default LogoWithText
