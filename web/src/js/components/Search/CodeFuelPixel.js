import React from 'react'
import PropTypes from 'prop-types'

// Impression tracking for search result items.
const CodeFuelPixel = ({ url }) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img src={url} style={{ display: 'none', width: 1, height: 1 }} />
}
CodeFuelPixel.propTypes = {
  url: PropTypes.string,
}
CodeFuelPixel.defaultProps = {
  url: null,
}

export default CodeFuelPixel
