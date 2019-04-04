import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const borderStyle = '1px solid #e4e4e4'

const styles = theme => ({
  wikiExtractHTML: {
    '& p': theme.typography.body2,
    '& i': theme.typography.body2,
    '& bold': theme.typography.body2,
  },
  wikiAttribution: {
    // Same as footer link color
    color: '#cecece',
    lineHeight: '110%',
  },
  wikiAttributionLink: {
    color: '#cecece',
    '&:hover': {
      color: '#838383',
    },
  },
})

const WikipediaPageComponent = props => {
  const {
    classes,
    description,
    extract,
    pageURL,
    style,
    theme,
    thumbnailURL,
    title,
  } = props
  return (
    <Paper data-test-id={'search-wiki'} elevation={1} style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: borderStyle,
        }}
      >
        <div style={{ flex: 5, padding: 20 }}>
          <Typography variant={'h5'} data-test-id={'search-wiki-title'}>
            {title}
          </Typography>
          {description ? (
            <Typography
              variant={'caption'}
              style={{ lineHeight: '110%', marginTop: 4 }}
              data-test-id={'search-wiki-desc'}
            >
              {description}
            </Typography>
          ) : null}
        </div>
        {thumbnailURL ? (
          <div
            style={{
              flex: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: 200,
              height: 150,
              overflow: 'hidden',
            }}
          >
            <img
              src={thumbnailURL}
              alt={'Thumbnail from Wikipedia'}
              data-test-id={'search-wiki-thumbnail'}
            />
          </div>
        ) : null}
      </div>
      <div style={{ padding: 20, borderBottom: borderStyle }}>
        <span
          data-test-id={'search-wiki-extract'}
          dangerouslySetInnerHTML={{ __html: extract }}
          className={classes.wikiExtractHTML}
        />{' '}
        <Typography variant={'body2'} data-test-id={'search-wiki-read-more'}>
          <a
            href={pageURL}
            style={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            Read more
          </a>
        </Typography>
      </div>
      <div style={{ padding: '12px 20px' }}>
        <Typography
          variant={'caption'}
          className={classes.wikiAttribution}
          data-test-id={'search-wiki-attrib'}
        >
          From{' '}
          <a href={pageURL} className={classes.wikiAttributionLink}>
            Wikipedia
          </a>
        </Typography>
        <Typography
          variant={'caption'}
          className={classes.wikiAttribution}
          data-test-id={'search-wiki-license'}
        >
          Content under{' '}
          <a
            href={'https://creativecommons.org/licenses/by-sa/3.0/'}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.wikiAttributionLink}
          >
            CC BY-SA
          </a>
        </Typography>
      </div>
    </Paper>
  )
}

WikipediaPageComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  description: PropTypes.string,
  extract: PropTypes.string.isRequired,
  pageURL: PropTypes.string.isRequired,
  style: PropTypes.object,
  thumbnailURL: PropTypes.string,
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
}

WikipediaPageComponent.defaultProps = {
  style: {},
}

export default withStyles(styles, { withTheme: true })(WikipediaPageComponent)
