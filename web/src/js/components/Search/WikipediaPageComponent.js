import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const WikipediaPageComponent = props => {
  const { extract, description, pageURL, style, thumbnailURL, title } = props
  return (
    <Paper data-test-id={'search-wiki-page'} elevation={1} style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e4e4e4',
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
              maxHeight: 150,
              overflow: 'hidden',
            }}
          >
            <img src={thumbnailURL} alt={'Thumbnail from Wikipedia'} />
          </div>
        ) : null}
      </div>
      <div style={{ padding: 20, borderBottom: '1px solid #e4e4e4' }}>
        <Typography variant={'body2'}>{extract}</Typography>
        <a href={pageURL}>
          <Typography variant={'body2'}>Read more</Typography>
        </a>
      </div>
      <div style={{ padding: 20 }}>
        <Typography variant={'body2'}>
          From <a href={pageURL}>Wikipedia</a>
        </Typography>
        <Typography variant={'body2'}>
          Content under{' '}
          <a
            href={'https://creativecommons.org/licenses/by-sa/3.0/'}
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-SA
          </a>
        </Typography>
      </div>
    </Paper>
  )
}

WikipediaPageComponent.propTypes = {
  description: PropTypes.string.isRequired,
  extract: PropTypes.string.isRequired,
  pageURL: PropTypes.string.isRequired,
  style: PropTypes.object,
  thumbnailURL: PropTypes.string,
  title: PropTypes.string.isRequired,
}

WikipediaPageComponent.defaultProps = {
  style: {},
}

export default WikipediaPageComponent
