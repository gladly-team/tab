import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { get } from 'lodash/object'
import {
  clipTextToNearestWord,
  getBingThumbnailURLToFillDimensions,
} from 'js/utils/search-utils'

// Make "time from" text much shorter:
// https://github.com/moment/moment/issues/2781#issuecomment-160739129
moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: '%dm',
    ss: '%ss',
    m: '1%dm',
    mm: '%dm',
    h: '1%dh',
    hh: '%dh',
    d: '1%dd',
    dd: '%dd',
    M: '1%dM',
    MM: '%dM',
    y: '1%dY',
    yy: '%dY',
  },
})

const styles = () => ({
  container: {
    // Same as WebPageSearchResult
    fontFamily: 'arial, sans-serif',
    marginBottom: 26,
  },
  topStoriesLabel: {
    marginBottom: 8,
  },
  newsItem: {
    margin: '0px 12px 0px 0px',
    minWidth: 200,
    height: 254,
    fontFamily: 'arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  newsItemImgAnchor: {
    textDecoration: 'none',
  },
  newsItemImgContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: 100,
    overflow: 'hidden',
    minHeight: 0,
    minWidth: 0,
  },
  newsItemTextContainer: {
    flex: 1,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  newsItemTitleAnchor: {
    textDecoration: 'none',
  },
  newsItemTitleText: {
    fontFamily: 'Roboto, arial, sans-serif',
    color: '#1a0dab',
    margin: 0,
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.38,
    minHeight: 0,
    minWidth: 0,
  },
  newsItemDescriptionContainer: {
    flex: 1,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
  },
  newsItemDescription: {
    fontSize: 13,
    color: '#505050', // Same as WebPageSearchResult description
    overflowWrap: 'break-word',
    overflow: 'hidden',
  },
  attributionText: {
    textOverflow: 'ellipsis',
    flexShrink: 1,
    flexGrow: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    margin: 0,
    fontSize: 13,
    color: '#007526', // Same as WebPageSearchResult displayed URL
    lineHeight: 1.5,
    minHeight: 0,
    minWidth: 0,
  },
  timeSincePublishedText: {
    flexShrink: 0,
    fontSize: 13,
    lineHeight: 1.5,
    color: 'rgba(0, 0, 0, 0.66)', // same color as search menu
    margin: 0,
  },
})

const NewsSearchItem = props => {
  const {
    classes,
    item: {
      contractualRules,
      datePublished,
      description,
      image,
      name,
      provider,
      url,
    },
  } = props
  // console.log('news item', props.item)

  // If the title or description are too long, slice them
  // and add ellipses.
  const subtitle = clipTextToNearestWord(description, 125)
  const title = clipTextToNearestWord(name, 80)

  const timeSincePublished =
    datePublished && moment(datePublished).isValid()
      ? moment(datePublished).fromNow()
      : null
  return (
    <Paper elevation={1} className={classes.newsItem}>
      {image ? (
        <a href={url} className={classes.newsItemImgAnchor}>
          <div className={classes.newsItemImgContainer}>
            <img
              src={getBingThumbnailURLToFillDimensions(
                image.thumbnail.contentUrl,
                {
                  width: 200,
                  height: 100,
                }
              )}
              alt=""
            />
          </div>
        </a>
      ) : null}
      <div className={classes.newsItemTextContainer}>
        <a href={url} className={classes.newsItemTitleAnchor}>
          <h3 className={classes.newsItemTitleText}>{title}</h3>
        </a>
        {// Only show the description if there is no image.
        image ? null : (
          <div className={classes.newsItemDescriptionContainer}>
            <p className={classes.newsItemDescription}>{subtitle}</p>
          </div>
        )}
        <div style={{ display: 'flex', marginTop: 'auto' }}>
          {contractualRules ? (
            contractualRules.map((contractualRule, index) => {
              return (
                <p
                  data-test-id={'search-result-news-attribution'}
                  key={index}
                  className={classes.attributionText}
                >
                  {contractualRule.text}
                </p>
              )
            })
          ) : get(provider, '[0].name') ? (
            <p
              data-test-id={'search-result-news-attribution'}
              key={'attribution-text'}
              className={classes.attributionText}
            >
              {get(provider, '[0].name')}
            </p>
          ) : null}
          {timeSincePublished ? (
            <p
              data-test-id={'search-result-news-time-since'}
              className={classes.timeSincePublishedText}
            >
              &nbsp;· {timeSincePublished}
            </p>
          ) : null}
        </div>
      </div>
    </Paper>
  )
}

NewsSearchItem.propTypes = {
  item: PropTypes.shape({
    category: PropTypes.string,
    clusteredArticles: PropTypes.array,
    contractualRules: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
      })
    ),
    datePublished: PropTypes.string, // might not exist
    description: PropTypes.string,
    headline: PropTypes.bool,
    id: PropTypes.string, // might not exist
    image: PropTypes.shape({
      thumbnail: PropTypes.shape({
        contentUrl: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
      }),
    }),
    mentions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    name: PropTypes.string.isRequired,
    provider: PropTypes.arrayOf(
      PropTypes.shape({
        _type: PropTypes.string,
        name: PropTypes.string,
        image: PropTypes.shape({
          thumbnail: PropTypes.shape({
            contentUrl: PropTypes.string,
          }),
        }),
      })
    ),
    url: PropTypes.string.isRequired,
    video: PropTypes.shape({
      allowHttpsEmbed: PropTypes.bool,
      embedHtml: PropTypes.string,
      motionThumbnailUrl: PropTypes.string,
      name: PropTypes.string,
      thumbnail: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
      }),
      thumbnailUrl: PropTypes.string,
    }),
  }).isRequired,
}

NewsSearchItem.defaultProps = {}

const NewsSearchResults = props => {
  const { classes, newsItems } = props

  // Only display 3 news items. If we want to display more,
  // we need horizontal scrolling.
  const newsItemsToShow = newsItems.slice(0, 3)
  return (
    <div className={classes.container}>
      <Typography variant={'h6'} className={classes.topStoriesLabel}>
        Top stories
      </Typography>
      <div
        style={{
          display: 'flex',
        }}
      >
        {newsItemsToShow.map(newsItem => (
          <NewsSearchItem
            key={newsItem.url}
            classes={classes}
            item={newsItem}
          />
        ))}
      </div>
    </div>
  )
}

NewsSearchResults.propTypes = {
  classes: PropTypes.object.isRequired,
  newsItems: PropTypes.arrayOf(NewsSearchItem.propTypes.item),
}

NewsSearchResults.defaultProps = {}

export default withStyles(styles)(NewsSearchResults)
