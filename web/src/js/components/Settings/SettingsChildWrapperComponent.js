import React from 'react'
import PropTypes from 'prop-types'
import FadeInAnimation from 'general/FadeInAnimation'

class SettingsChildWrapper extends React.Component {
  render () {
    const { children, loaded } = this.props
    return (
      <div
        style={{
          padding: 20,
          minHeight: 400
        }}
      >
        { loaded
          ? (
            children
              ? (
                <FadeInAnimation>
                  { children }
                </FadeInAnimation>
              )
              : null
          )
          : null
        }
      </div>
    )
  }
}

SettingsChildWrapper.propTypes = {
  children: PropTypes.element,
  loaded: PropTypes.bool
}

SettingsChildWrapper.defaultProps = {
  loaded: false
}

export default SettingsChildWrapper
