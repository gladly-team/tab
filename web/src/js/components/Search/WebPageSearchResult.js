import React from 'react'
import PropTypes from 'prop-types'

// TODO: use class styles

const WebPageSearchResult = props => {
  const {
    // eslint-disable-next-line no-unused-vars
    item: { deepLinks, displayUrl, name, snippet, url },
  } = props
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
    displayUrl: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    snippet: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
}

WebPageSearchResult.defaultProps = {}

export default WebPageSearchResult
