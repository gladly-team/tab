import React from 'react'
import PropTypes from 'prop-types'
import NewsSearchResults from 'js/components/Search/NewsSearchResults'
import WebPageSearchResult from 'js/components/Search/WebPageSearchResult'

// Delegates search result item rendering to the appropriate component.
const SearchResultItem = props => {
  const { type, itemData } = props

  // Render a different component depending on the result type.
  switch (type) {
    case 'WebPages': {
      return <WebPageSearchResult key={itemData.id} item={itemData} />
    }
    case 'News': {
      if (!itemData.length) {
        console.error(`No news items found for:`, itemData)
        return null
      }
      return <NewsSearchResults key={'news-results'} newsItems={itemData} />
    }
    default: {
      return null
    }
  }
}

SearchResultItem.propTypes = {
  type: PropTypes.string.isRequired,
  itemData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
}

export default SearchResultItem
