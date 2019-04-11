import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  container: {
    fontFamily: 'arial, sans-serif',
    marginBottom: 26,
  },
  titleLink: {
    textDecoration: 'none',
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
  deepLinksContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingLeft: 0,
  },
  deepLink: {
    flex: '42%',
    maxWidth: '42%',
    padding: '10px 24px',
  },
})

export const DeepLink = props => {
  const {
    classes,
    item: { name, snippet, url },
  } = props

  // If the title or snippet are too long, slice them
  // and add ellipses.
  const MAX_TITLE_CHARS = 24
  const MAX_DESC_CHARS = 76
  const title =
    name.length > MAX_TITLE_CHARS
      ? `${name.slice(0, MAX_TITLE_CHARS)} ...`
      : name
  const description =
    snippet && snippet.length > MAX_DESC_CHARS
      ? `${snippet.slice(0, MAX_DESC_CHARS)} ...`
      : snippet
  return (
    <div className={classes.deepLink}>
      <a href={url} className={classes.titleLink}>
        <h3 className={classes.title}>{title}</h3>
      </a>
      {snippet ? <div className={classes.snippet}>{description}</div> : null}
    </div>
  )
}

DeepLink.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    snippet: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
}

const WebPageSearchResult = props => {
  const {
    classes,
    item: { deepLinks, displayUrl, name, snippet, url },
  } = props

  // If any required props are missing, don't render anything.
  if (!(displayUrl && name && snippet && url)) {
    return null
  }
  return (
    <div className={classes.container}>
      <a href={url} className={classes.titleLink}>
        <h3 className={classes.title}>{name}</h3>
      </a>
      <div
        data-test-id={'search-result-webpage-url'}
        className={classes.displayUrl}
      >
        {displayUrl}
      </div>
      <div
        data-test-id={'search-result-webpage-snippet'}
        className={classes.snippet}
      >
        {snippet}
      </div>
      {deepLinks && deepLinks.length ? (
        <div className={classes.deepLinksContainer}>
          {deepLinks.map((deepLink, index) => {
            return (
              <DeepLink key={deepLink.url} classes={classes} item={deepLink} />
            )
          })}
        </div>
      ) : null}
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
