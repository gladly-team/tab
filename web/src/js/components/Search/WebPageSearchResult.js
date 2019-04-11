import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import CircleIcon from '@material-ui/icons/Lens'

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
    marginTop: 2,
  },
  deepLinkParent: {
    display: 'flex',
    alignItems: 'center',
  },
  deepLink: {
    color: '#1a0dab',
    fontSize: 13,
    lineHeight: 1.5,
    textDecoration: 'none',
  },
  deepLinkDivider: {
    color: 'rgba(0, 0, 0, 0.66)',
    width: 3,
    fontSize: 10,
    margin: '0px 8px',
  },
})

// TODO: use class styles

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
      <div className={classes.displayUrl}>{displayUrl}</div>
      <div className={classes.snippet}>{snippet}</div>
      {deepLinks && deepLinks.length ? (
        <div className={classes.deepLinksContainer}>
          {deepLinks.map((deepLink, index) => {
            return (
              <div key={deepLink.url} className={classes.deepLinkParent}>
                <a href={deepLink.url} className={classes.deepLink}>
                  {deepLink.name}
                </a>
                {index < deepLinks.length - 1 ? (
                  <CircleIcon className={classes.deepLinkDivider} />
                ) : null}
              </div>
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
