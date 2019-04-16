import React from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'
import NewsSearchResults from 'js/components/Search/NewsSearchResults'
import WebPageSearchResult from 'js/components/Search/WebPageSearchResult'

const stripHTML = html => {
  return html
    ? sanitizeHtml(html, {
        allowedTags: [],
        allowedAttributes: {},
      })
    : undefined
}

// Delegates search result item rendering to the appropriate component.
const SearchResultItem = props => {
  const { type, itemData } = props

  // Render a different component depending on the result type.
  switch (type) {
    case 'WebPages': {
      let webPageItem = Object.assign({}, itemData, {
        displayUrl: stripHTML(itemData.displayUrl),
        name: stripHTML(itemData.name),
        snippet: stripHTML(itemData.snippet),
      })
      return <WebPageSearchResult key={webPageItem.id} item={webPageItem} />
    }
    case 'News': {
      let newsItems = itemData.map(newsItem => {
        return Object.assign({}, newsItem, {
          description: stripHTML(newsItem.description),
          displayUrl: stripHTML(newsItem.displayUrl),
          name: stripHTML(newsItem.name),
        })
      })
      if (!newsItems.length) {
        console.error(`No news items found for:`, itemData)
        return null
      }
      return <NewsSearchResults key={'news-results'} newsItems={newsItems} />
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
