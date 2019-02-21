import React from 'react'
import PropTypes from 'prop-types'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'

const SearchMenuComponent = props => {
  const { style, app } = props
  return (
    <div style={style}>
      <MoneyRaised app={app} />
    </div>
  )
}

SearchMenuComponent.displayName = 'SearchMenuComponent'

SearchMenuComponent.propTypes = {
  // May not exist if the user is not signed in.
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
  app: PropTypes.shape({}).isRequired,
}

SearchMenuComponent.defaultProps = {}

export default SearchMenuComponent
