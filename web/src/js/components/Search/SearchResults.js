import React from 'react'
import PropTypes from 'prop-types'
import { shuffle } from 'lodash/collection'
import { camelCase, upperCase, lowerCase } from 'lodash/string'
import SearchTextResult from 'js/components/Search/SearchTextResult'

// Just for fun in development.
const getFakeSearchResults = query => {
  const encodedQuery = encodeURIComponent(query)
  const reversedQuery = query.split('').reverse().join('')
  return shuffle([
    {
      title: `You want ${query}?`,
      linkURL: `https://www.google.com/search?q=${encodedQuery}`,
      snippet: `I guess you want ${query}? That's awesome. It's truly one of the best
        things you could be searching for. I hope you find a search result you like,
        because we're trying to ...`
    },
    {
      title: `"${query}", the new hit single from Kesha`,
      linkURL: `https://www.google.com/search?q=kesha%20${encodedQuery}`,
      snippet: `This track will most likely change your life.`
    },
    {
      title: `How to say "${query}" in Latin`,
      linkURL: `https://www.google.com/search?q=latin%20lessons`,
      snippet: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
       veniam, quis nostrud exercitation ...`
    },
    {
      title: `Tab for a Cause, the search result you're looking for`,
      linkURL: `https://tab.gladly.io/`,
      snippet: `Raise money for charity simply by surfing the web! It takes less
        than 30 seconds to start having an impact.`
    },
    {
      title: `${reversedQuery}: taking a different perspective`,
      linkURL: `https://en.wikipedia.org/wiki/Mirror`,
      snippet: `We'll help you look at ${query} from a different perspective.`
    },
    {
      title: `House majority leader: Opponents support "unlimited ${query}"`,
      linkURL: `https://www.nytimes.com/`,
      snippet: `"Our friends across the aisle want every American to have
        unlimited ${query}, regardless of the remarkable costs. We cannot keep
        spending profligately like this."`
    },
    {
      title: `${camelCase(query)} ${lowerCase(query)} ${lowerCase(query)}
        ${upperCase(query)} ${query}`,
      linkURL: `http://www.example.com/`,
      snippet: `${camelCase(query)} ${upperCase(query)} ${query} ${query} ${upperCase(query)}
        (plus tacos) ${lowerCase(query)}`
    }
  ])
}

class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      results: getFakeSearchResults(this.props.query)
    }
  }

  render () {
    const { query } = this.props
    if (!query) {
      return null
    }
    return (
      <div
        data-test-id='search-results-container'
        style={{
          background: 'none',
          marginLeft: 170,
          maxWidth: 600,
          paddingTop: 20
        }}
      >
        {
          this.state.results.map((result, index) => (
            <SearchTextResult
              key={`key-${index}`}
              result={{
                title: result.title,
                linkURL: result.linkURL,
                snippet: result.snippet
              }}
            />
          ))
        }
      </div>
    )
  }
}

SearchResults.propTypes = {
  query: PropTypes.string
}

SearchResults.defaultProps = {}

export default SearchResults
