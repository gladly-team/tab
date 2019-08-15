import React from 'react'
import PropTypes from 'prop-types'

const SettingsChildWrapper = props => {
  const { children } = props
  return (
    <div
      style={{
        padding: 20,
        minHeight: 400,
      }}
    >
      {children}
    </div>
  )
}

SettingsChildWrapper.propTypes = {
  children: PropTypes.element,
}

SettingsChildWrapper.defaultProps = {}

export default SettingsChildWrapper
