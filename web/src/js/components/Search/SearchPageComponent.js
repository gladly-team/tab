import React from 'react'
import PropTypes from 'prop-types'
import { isSearchPageEnabled } from 'js/utils/feature-flags'
import {
  goTo,
  dashboardURL
} from 'js/navigation/navigation'
import LogoWithText from 'js/components/Logo/LogoWithText'

class SearchPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchFeatureEnabled: isSearchPageEnabled()
    }
  }

  componentDidMount () {
    if (!this.state.searchFeatureEnabled) {
      goTo(dashboardURL)
    }
  }

  render () {
    if (!this.state.searchFeatureEnabled) {
      return null
    }
    return (
      <div
        data-test-id={'search-page'}
        style={{
          backgroundColor: '#fff',
          minWidth: '100vw',
          minHeight: '100vh'
        }}
      >
        <div
          style={{
            backgroundColor: '#F2F2F2',
            padding: 8
            // borderBottom: '1px solid #BDBDBD'
          }}
        >
          <LogoWithText
            style={{
              height: 34,
              margin: 8
            }}
          />
        </div>
      </div>
    )
  }
}

SearchPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  app: PropTypes.shape({
    // TODO: pass these to the MoneyRaised component
    // moneyRaised: PropTypes.number.isRequired,
    // dollarsPerDayRate: PropTypes.number.isRequired
  })
}

SearchPage.defaultProps = {}

export default SearchPage
