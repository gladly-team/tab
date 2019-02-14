import React from 'react'
import PropTypes from 'prop-types'

const SearchMenuComponent = props => {
  const {
    style,
    app: { moneyRaised },
  } = props
  return (
    <div style={style}>
      <div>Money raised: ${moneyRaised}</div>
    </div>
  )
}

SearchMenuComponent.displayName = 'SearchMenuComponent'

SearchMenuComponent.propTypes = {
  // May not exist if the user is not signed in.
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
  app: PropTypes.shape({
    // TODO: move these to the MoneyRaised component
    moneyRaised: PropTypes.number.isRequired,
    dollarsPerDayRate: PropTypes.number.isRequired,
  }),
}

SearchMenuComponent.defaultProps = {}

export default SearchMenuComponent
