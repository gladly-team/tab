import React from 'react'
import PropTypes from 'prop-types'

// TODO: use class styles

const WebPageSearchResult = props => {
  const {
    item: { displayUrl, name, snippet, url },
  } = props

  // If any required props are missing, don't render anything.
  if (!(displayUrl && name && snippet && url)) {
    return null
  }
  return (
    <div
      style={{
        fontFamily: 'arial, sans-serif',
        marginBottom: 24,
      }}
    >
      <a href={url} style={{ textDecoration: 'none' }}>
        <h3
          style={{
            fontFamily: 'Roboto, arial, sans-serif',
            color: '#1a0dab',
            margin: 0,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1.38,
          }}
        >
          {name}
        </h3>
      </a>
      <div
        style={{
          fontSize: 13,
          color: '#007526',
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {displayUrl}
      </div>
      <div
        style={{
          fontSize: 13,
          color: '#505050',
          overflowWrap: 'break-word',
        }}
      >
        {snippet}
      </div>
    </div>
  )
}

WebPageSearchResult.propTypes = {
  item: PropTypes.shape({
    deepLinks: PropTypes.array,
    displayUrl: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
}

WebPageSearchResult.defaultProps = {}

export default WebPageSearchResult
