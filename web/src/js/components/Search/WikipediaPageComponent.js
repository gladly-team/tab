import React from 'react'
import PropTypes from 'prop-types'

const WikipediaPageComponent = props => {
  const { extract, description, pageURL, thumbnailURL, title } = props
  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      {thumbnailURL ? (
        <img
          src={thumbnailURL}
          alt={'Thumbnail from Wikipedia'}
          style={{
            maxHeight: 180,
          }}
        />
      ) : null}
      <p>{extract}</p>
      <a href={pageURL}>Read more</a>
      <p>
        From <a href={pageURL}>Wikipedia</a>
      </p>
      <p>
        Content under{' '}
        <a
          href={'https://creativecommons.org/licenses/by-sa/3.0/'}
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-SA
        </a>
      </p>
    </div>
  )
}

WikipediaPageComponent.propTypes = {
  description: PropTypes.string.isRequired,
  extract: PropTypes.string.isRequired,
  pageURL: PropTypes.string.isRequired,
  thumbnailURL: PropTypes.string,
  title: PropTypes.string.isRequired,
}

WikipediaPageComponent.defaultProps = {}

export default WikipediaPageComponent
