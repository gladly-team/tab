import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import fetchWikipediaResults from 'js/components/Search/fetchWikipediaResults'

class WikipediaQuery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      queryComplete: false,
      responseData: null,
    }
  }

  componentDidMount() {
    this.queryWikipedia()
  }

  async queryWikipedia() {
    const { query } = this.props
    console.log(`Querying Wikipedia with query ${query}`)
    if (!query) {
      return
    }
    const results = await fetchWikipediaResults(query)
    this.setState({
      responseData: results,
    })
  }

  render() {
    const { responseData } = this.state
    const pageData = get(responseData, 'query.pages[0]')
    if (!pageData) {
      return <div>Nothing found</div>
    }
    // console.log(pageData)
    const {
      title,
      description,
      extract,
      fullurl: pageURL,
      thumbnail: { source: thumbnailURL },
    } = pageData
    return (
      <div>
        <div>{title}</div>
        <div>{description}</div>
        <img
          src={thumbnailURL}
          alt={'Thumbnail from Wikipedia'}
          style={{
            maxHeight: 180,
          }}
        />
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
}

WikipediaQuery.propTypes = {
  query: PropTypes.string.isRequired,
}

WikipediaQuery.defaultProps = {}

export default WikipediaQuery
