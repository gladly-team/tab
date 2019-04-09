import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// TODO: use class styles

const NewsSearchItem = props => {
  const {
    item: {
      // eslint-disable-next-line no-unused-vars
      category,
      contractualRules,
      // eslint-disable-next-line no-unused-vars
      datePublished,
      description,
      image,
      name,
      url,
    },
  } = props

  // If the title or description are too long, slice them
  // and add ellipses.
  const MAX_DESC_CHARS = 125
  const MAX_TITLE_CHARS = 80
  const subtitle =
    description.length > MAX_DESC_CHARS
      ? `${description.slice(0, MAX_DESC_CHARS)} ...`
      : name
  const title =
    name.length > MAX_TITLE_CHARS
      ? `${name.slice(0, MAX_TITLE_CHARS)} ...`
      : name

  // TODO
  // const timeSincePublished = datePublished
  return (
    <Paper
      elevation={1}
      style={{
        margin: '0px 12px 0px 0px',
        minWidth: 200,
        height: 254,
        fontFamily: 'arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {image ? (
        <a href={url} style={{ textDecoration: 'none' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              overflow: 'hidden',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <img src={image.thumbnail.contentUrl} alt="" />
          </div>
        </a>
      ) : null}
      <div
        style={{
          flex: 1,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <a href={url} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontFamily: 'Roboto, arial, sans-serif',
              color: '#1a0dab',
              margin: 0,
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.38,
              minHeight: 0,
              minWidth: 0,
            }}
          >
            {title}
          </h3>
        </a>
        {// Only show the description if there is no image.
        image ? null : (
          <div
            style={{
              flex: 1,
              margin: 0,
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: '#505050',
                overflowWrap: 'break-word',
                overflow: 'hidden',
              }}
            >
              {subtitle}
            </p>
          </div>
        )}
        {contractualRules.map((contractualRule, index) => {
          return (
            <p
              key={index}
              style={{
                flexShrink: 0,
                marginTop: 'auto',
                marginBottom: 0,
                fontSize: 13,
                color: '#007526',
                lineHeight: 1.5,
                minHeight: 0,
                minWidth: 0,
              }}
            >
              {contractualRule.text}
            </p>
          )
        })}
      </div>
    </Paper>
  )
}

NewsSearchItem.propTypes = {
  item: PropTypes.shape({
    category: PropTypes.string,
    contractualRules: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
      })
    ),
    datePublished: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.shape({
      thumbnail: PropTypes.shape({
        contentUrl: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
      }),
    }),
    name: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
}

NewsSearchItem.defaultProps = {}

const NewsSearchResults = props => {
  const { newsItems } = props

  // Only display 3 news items. If we want to display more,
  // we need horizontal scrolling.
  const newsItemsToShow = newsItems.slice(0, 3)
  return (
    <div
      style={{
        fontFamily: 'arial, sans-serif',
        marginBottom: 24,
      }}
    >
      <Typography variant={'h6'} style={{ marginBottom: 8 }}>
        Top stories
      </Typography>
      <div
        style={{
          display: 'flex',
        }}
      >
        {newsItemsToShow.map(newsItem => (
          <NewsSearchItem key={newsItem.url} item={newsItem} />
        ))}
      </div>
    </div>
  )
}

NewsSearchResults.propTypes = {
  newsItems: PropTypes.arrayOf(NewsSearchItem.propTypes.item),
}

NewsSearchResults.defaultProps = {}

export default NewsSearchResults
