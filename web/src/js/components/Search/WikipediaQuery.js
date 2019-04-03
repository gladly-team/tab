import React from 'react'
import PropTypes from 'prop-types'
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
    return <div>{JSON.stringify(responseData)}</div>
  }
}

WikipediaQuery.propTypes = {
  query: PropTypes.string.isRequired,
}

WikipediaQuery.defaultProps = {}

export default WikipediaQuery
