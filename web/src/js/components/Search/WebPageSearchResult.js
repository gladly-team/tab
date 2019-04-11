import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  container: {
    fontFamily: 'arial, sans-serif',
    marginBottom: 26,
  },
  title: {
    fontFamily: 'Roboto, arial, sans-serif',
    color: '#1a0dab',
    margin: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.38,
  },
  displayUrl: {
    fontSize: 13,
    color: '#007526',
    lineHeight: 1.56,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  snippet: {
    fontSize: 13,
    lineHeight: 1.5,
    color: '#505050',
    overflowWrap: 'break-word',
  },
})

// TODO: use class styles

const WebPageSearchResult = props => {
  const {
    classes,
    item: { displayUrl, name, snippet, url },
  } = props

  // If any required props are missing, don't render anything.
  if (!(displayUrl && name && snippet && url)) {
    return null
  }
  return (
    <div className={classes.container}>
      <a href={url} style={{ textDecoration: 'none' }}>
        <h3 className={classes.title}>{name}</h3>
      </a>
      <div className={classes.displayUrl}>{displayUrl}</div>
      <div className={classes.snippet}>{snippet}</div>
    </div>
  )
}

WebPageSearchResult.propTypes = {
  classes: PropTypes.object.isRequired,
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

export default withStyles(styles)(WebPageSearchResult)
