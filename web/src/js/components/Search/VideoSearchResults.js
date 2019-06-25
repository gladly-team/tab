import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { get } from 'lodash/object'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {
  clipTextToNearestWord,
  getBingThumbnailURLToFillDimensions,
} from 'js/utils/search-utils'

const styles = () => ({
  container: {
    // Same as WebPageSearchResult
    fontFamily: 'arial, sans-serif',
    marginBottom: 26,
  },
  videosLabel: {
    marginBottom: 8,
  },
  videoItem: {
    margin: '0px 12px 0px 0px',
    minWidth: 200,
    height: 254,
    fontFamily: 'arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  videoItemImgAnchor: {
    textDecoration: 'none',
  },
  videoItemImgContainer: {
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
  videoItemTextContainer: {
    flex: 1,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  videoItemTitleAnchor: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  videoItemTitleText: {
    fontFamily: 'Roboto, arial, sans-serif',
    color: '#1a0dab',
    margin: 0,
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.38,
    minHeight: 0,
    minWidth: 0,
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

export const VideoSearchItem = props => {
  const {
    classes,
    item: { datePublished, hostPageUrl, name, publisher, thumbnailUrl },
  } = props

  // If the title is too long, slice it and add ellipses.
  const title = clipTextToNearestWord(name, 80)

  const timeSincePublished =
    datePublished && moment(datePublished).isValid()
      ? moment(datePublished).fromNow()
      : null
  return (
    <Paper
      elevation={1}
      className={classes.videoItem}
      data-test-id={'search-result-video-container'}
    >
      {thumbnailUrl ? (
        <a
          href={hostPageUrl}
          className={classes.videoItemImgAnchor}
          data-test-id={'search-result-video-img-container'}
        >
          <div className={classes.videoItemImgContainer}>
            <img
              src={getBingThumbnailURLToFillDimensions(thumbnailUrl, {
                width: 200,
                height: 100,
              })}
              alt=""
            />
          </div>
        </a>
      ) : null}
      <div className={classes.videoItemTextContainer}>
        <a href={hostPageUrl} className={classes.videoItemTitleAnchor}>
          <h3
            className={classes.videoItemTitleText}
            data-test-id={'search-result-video-title'}
          >
            {title}
          </h3>
        </a>
        <div style={{ display: 'flex', marginTop: 'auto' }}>
          {get(publisher, '[0].name') ? (
            <p
              data-test-id={'search-result-video-attribution'}
              className={classes.attributionText}
            >
              {get(publisher, '[0].name')}
            </p>
          ) : null}
          {timeSincePublished ? (
            <p
              data-test-id={'search-result-video-time-since'}
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

VideoSearchItem.propTypes = {
  item: PropTypes.shape({
    allowHttpsEmbed: PropTypes.bool,
    allowMobileEmbed: PropTypes.bool,
    contentUrl: PropTypes.string.isRequired,
    datePublished: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.string,
    embedHtml: PropTypes.string,
    encodingFormat: PropTypes.string,
    height: PropTypes.number,
    hostPageDisplayUrl: PropTypes.string,
    hostPageUrl: PropTypes.string.isRequired,
    hostPageUrlPingSuffix: PropTypes.string,
    isAccessibleForFree: PropTypes.bool,
    isSuperfresh: PropTypes.bool,
    motionThumbnailUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
    publisher: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    thumbnail: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number,
    }),
    thumbnailUrl: PropTypes.string,
    viewCount: PropTypes.number,
    webSearchUrl: PropTypes.string,
    webSearchUrlPingSuffix: PropTypes.string,
    width: PropTypes.number,
  }).isRequired,
}

VideoSearchItem.defaultProps = {}

const VideoSearchResults = props => {
  const { classes, videoItems } = props

  // Only display 3 video items. If we want to display more,
  // we need horizontal scrolling.
  const videoItemsToShow = videoItems.slice(0, 3)
  return (
    <div className={classes.container}>
      <Typography variant={'h6'} className={classes.videosLabel}>
        Videos
      </Typography>
      <div
        style={{
          display: 'flex',
        }}
      >
        {videoItemsToShow.map(videoItem => (
          <VideoSearchItem
            key={videoItem.hostPageUrl}
            classes={classes}
            item={videoItem}
          />
        ))}
      </div>
    </div>
  )
}

VideoSearchResults.propTypes = {
  classes: PropTypes.object.isRequired,
  videoItems: PropTypes.arrayOf(VideoSearchItem.propTypes.item),
}

VideoSearchResults.defaultProps = {}

export default withStyles(styles)(VideoSearchResults)
