import React from 'react'
import PropTypes from 'prop-types'
import tabLogoDefault from 'js/assets/logos/logo.svg'
import tabLogoWhite from 'js/assets/logos/logo-white.svg'
import tabLogoWithText from 'js/assets/logos/logo-with-text.svg'
import searchLogoDefault from 'js/assets/logos/search-logo.svg'
import searchLogoWithText from 'js/assets/logos/search-logo-with-text.svg'

class Logo extends React.Component {
  render() {
    const { brand, color, includeText, style } = this.props
    const finalStyle = Object.assign(
      {},
      {
        height: 40,
      },
      style
    )
    let logo
    switch (brand) {
      case 'tab': {
        if (includeText) {
          logo = tabLogoWithText
          break
        }
        switch (color) {
          case 'purple': {
            logo = tabLogoDefault
            break
          }
          case 'white': {
            logo = tabLogoWhite
            break
          }
          default: {
            throw new Error(`No "tab" logo exists with color "${color}".`)
          }
        }
        break
      }
      case 'search': {
        if (includeText) {
          logo = searchLogoWithText
          break
        } else {
          logo = searchLogoDefault
          break
        }
      }
      default: {
        throw new Error(`No logo exists for brand "${brand}".`)
      }
    }
    return <img style={finalStyle} src={logo} alt="Tab for a Cause logo" />
  }
}

Logo.props = {
  brand: PropTypes.oneOf(['tab', 'search']),
  includeText: PropTypes.bool.isRequired,
  style: PropTypes.object,
  color: PropTypes.oneOf(['purple', 'white']),
}

Logo.defaultProps = {
  brand: 'tab',
  includeText: false,
  style: {},
  color: 'purple',
}

export default Logo
