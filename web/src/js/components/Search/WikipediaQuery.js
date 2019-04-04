import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import fetchWikipediaResults from 'js/components/Search/fetchWikipediaResults'
import WikipediaPage from 'js/components/Search/WikipediaPageComponent'

class WikipediaQuery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      queryInProgress: false,
      responseData: null,
    }
  }

  componentDidMount() {
    this.queryWikipedia()
  }

  componentDidUpdate(prevProps) {
    // Fetch Wikipedia data if a query exists and has changed.
    if (this.props.query && this.props.query !== prevProps.query) {
      this.queryWikipedia()
    }
  }

  async queryWikipedia() {
    const { query } = this.props
    if (!query) {
      return
    }
    this.setState({
      queryInProgress: true,
    })
    console.log(`Querying Wikipedia with query ${query}`)
    const results = await fetchWikipediaResults(query)
    this.setState({
      responseData: results,
      queryInProgress: false,
    })
  }

  render() {
    const { responseData, queryInProgress } = this.state
    const pageData = get(responseData, 'query.pages[0]')
    if (queryInProgress) {
      return null
    }
    if (!pageData) {
      return <div>Nothing found</div>
    }
    // console.log(pageData)
    const {
      title,
      description,
      extract,
      fullurl: pageURL,
      thumbnail: { source: thumbnailURL } = {},
    } = pageData

    // TODO: sanitize the extract HTML
    return (
      <WikipediaPage
        title={title}
        description={description}
        thumbnailURL={thumbnailURL}
        extract={extract}
        pageURL={pageURL}
      />
    )
  }
}

WikipediaQuery.propTypes = {
  query: PropTypes.string.isRequired,
}

WikipediaQuery.defaultProps = {}

export default WikipediaQuery
