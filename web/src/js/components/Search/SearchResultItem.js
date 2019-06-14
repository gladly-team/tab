import React from 'react'
import PropTypes from 'prop-types'
import NewsSearchResults from 'js/components/Search/NewsSearchResults'
import TextAdSearchResult from 'js/components/Search/TextAdSearchResult'
import WebPageSearchResult from 'js/components/Search/WebPageSearchResult'

// Delegates search result item rendering to the appropriate component.
const SearchResultItem = props => {
  const { type, itemData, ...otherProps } = props

  // Render a different component depending on the result type.
  switch (type) {
    case 'WebPages': {
      return (
        <WebPageSearchResult
          key={itemData.id}
          item={itemData}
          {...otherProps}
        />
      )
    }
    case 'News': {
      if (!itemData.length) {
        console.error(`No news items found for:`, itemData)
        return null
      }
      return (
        <NewsSearchResults
          key={'news-results'}
          newsItems={itemData}
          {...otherProps}
        />
      )
    }
    case 'Ads': {
      const adType = itemData._type
      if (!adType) {
        console.error('"Ads" item did not have a _type value.', itemData)
        return null
      }

      // Determine which type of ad to render.
      switch (adType) {
        case 'Ads/TextAd': {
          return (
            <TextAdSearchResult
              key={itemData.id}
              item={itemData}
              {...otherProps}
            />
          )
        }
        default: {
          console.error(`Could not render an ad with unhandled type ${adType}.`)
          return null
        }
      }
    }
    default: {
      // console.log(`Could not render item of type ${type}.`)
      return null
    }
  }
}

SearchResultItem.propTypes = {
  type: PropTypes.string.isRequired,
  itemData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
}

export default SearchResultItem
