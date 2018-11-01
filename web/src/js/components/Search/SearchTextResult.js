import React from 'react'
import PropTypes from 'prop-types'

class SearchTextResult extends React.Component {
  render () {
    const { result } = this.props
    return (
      <div
        style={{
          fontFamily: 'arial, sans-serif',
          marginBottom: 24
        }}
      >
        <a href={result.linkURL} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontFamily: 'Roboto, arial, sans-serif',
              color: '#1a0dab',
              margin: 0,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.38
            }}
          >
            {result.title}
          </h3>
        </a>
        <div
          style={{
            fontSize: 13,
            color: '#007526',
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {result.linkURL}
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#505050',
            overflowWrap: 'break-word'
          }}
        >
          {result.snippet}
        </div>
      </div>
    )
  }
}

SearchTextResult.propTypes = {
  result: PropTypes.shape({
    title: PropTypes.string.isRequired,
    linkURL: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired
  })
}

SearchTextResult.defaultProps = {}

export default SearchTextResult
