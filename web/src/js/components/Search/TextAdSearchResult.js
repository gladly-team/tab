import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { find } from 'lodash/collection'
import { get } from 'lodash/object'

export const SiteLink = props => {
  const {
    classes,
    item: { text, descriptionLine1, descriptionLine2, link },
  } = props

  return (
    <div className={classes.siteLink}>
      <a href={link} className={classes.titleLink}>
        <h3 className={classes.title}>{text}</h3>
      </a>
      {descriptionLine1 ? (
        <div className={classes.snippet}>
          {descriptionLine1} {descriptionLine2}
        </div>
      ) : null}
    </div>
  )
}

SiteLink.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    descriptionLine1: PropTypes.string,
    descriptionLine2: PropTypes.string,
    link: PropTypes.string.isRequired,
    pingUrlSuffix: PropTypes.string,
    text: PropTypes.string.isRequired,
  }).isRequired,
}

const styles = () => ({
  adLabel: {
    fontSize: 9,
    color: 'rgba(0, 0, 0, 0.46)', // same color as results count
    border: '1px solid #cecece', // same color as lightest page text
    borderRadius: 4,
    padding: '1px 2px',
    marginRight: 5,
    marginBottom: 1,
  },
  container: {
    fontFamily: 'arial, sans-serif',
    marginBottom: 26,
  },
  titleLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  // Note: we cannot truncate the title.
  title: {
    fontFamily: 'Roboto, arial, sans-serif',
    color: '#1a0dab',
    margin: 0,
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.38,
  },
  displayUrl: {
    fontSize: 13,
    color: '#007526',
    lineHeight: 1.56,
  },
  snippetContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Note: we cannot truncate the description/snippet.
  snippet: {
    fontSize: 13,
    lineHeight: 1.5,
    color: '#505050',
    overflowWrap: 'break-word',
  },
  siteLinkContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingLeft: 0,
  },
  siteLink: {
    flex: '42%',
    maxWidth: '42%',
    padding: '10px 24px',
  },
})

const TextAdSearchResult = props => {
  const {
    classes,
    item: { description, displayUrl, extensions = [], title, url },
  } = props
  const siteLinks = get(
    find(extensions, { _type: 'Ads/SiteLinkExtension' }),
    'sitelinks'
  )

  // If any required props are missing, don't render anything.
  if (!(displayUrl && title && url)) {
    return null
  }

  return (
    <div className={classes.container}>
      <a href={url} className={classes.titleLink}>
        <h3 className={classes.title}>{title}</h3>
      </a>
      <div
        data-test-id={'search-result-webpage-url'}
        className={classes.displayUrl}
      >
        {displayUrl}
      </div>
      <div className={classes.snippetContainer}>
        <span className={classes.adLabel}>Ad</span>
        <span
          data-test-id={'search-result-webpage-snippet'}
          className={classes.snippet}
        >
          {description}
        </span>
      </div>
      {siteLinks ? (
        <div
          data-test-id={'search-result-webpage-deep-link-container'}
          className={classes.siteLinkContainer}
        >
          {siteLinks.map((siteLink, index) => {
            return (
              <SiteLink key={siteLink.link} classes={classes} item={siteLink} />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

TextAdSearchResult.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    _type: PropTypes.string.isRequired,
    businessName: PropTypes.string,
    description: PropTypes.string,
    displayUrl: PropTypes.string.isRequired,
    extensions: PropTypes.array,
    id: PropTypes.string.isRequired,
    isAdult: PropTypes.bool,
    phoneNumber: PropTypes.string,
    position: PropTypes.oneOf(['Mainline', 'Sidebar']),
    rank: PropTypes.number,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    urlPingSuffix: PropTypes.string,
  }).isRequired,
}

TextAdSearchResult.defaultProps = {}

export default withStyles(styles)(TextAdSearchResult)
