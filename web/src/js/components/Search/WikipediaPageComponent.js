import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { withTheme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const borderStyle = '1px solid #e4e4e4'

// We're using the theme data in our styles. See:
// https://github.com/mui-org/material-ui/issues/8726#issuecomment-452047345
const useStyles = makeStyles({
  wikiExtractHTML: props => ({
    '& p': props.theme.typography.body2,
  }),
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
    description,
    extract,
    pageURL,
    style,
    theme,
    thumbnailURL,
    title,
  } = props
  const classes = useStyles({
    theme: theme,
  })
  return (
    <Paper data-test-id={'search-wiki-page'} elevation={1} style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: borderStyle,
        }}
      >
        <div style={{ flex: 5, padding: 20 }}>
          <Typography variant={'h5'}>{title}</Typography>
          <Typography variant={'caption'} style={{ lineHeight: '110%' }}>
            {description}
          </Typography>
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
            <img src={thumbnailURL} alt={'Thumbnail from Wikipedia'} />
          </div>
        ) : null}
      </div>
      <div style={{ padding: 20, borderBottom: borderStyle }}>
        <span
          dangerouslySetInnerHTML={{ __html: extract }}
          className={classes.wikiExtractHTML}
        />{' '}
        <Typography variant={'body2'}>
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
        <Typography variant={'caption'} className={classes.wikiAttribution}>
          From{' '}
          <a href={pageURL} className={classes.wikiAttributionLink}>
            Wikipedia
          </a>
        </Typography>
        <Typography variant={'caption'} className={classes.wikiAttribution}>
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
  // TODO: make description optional
  description: PropTypes.string.isRequired,
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

export default withTheme()(WikipediaPageComponent)
