import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'js/relay-env'
import SearchPageContainer from 'js/components/Search/SearchPageContainer'
import withUserId from 'js/components/General/withUserId'
import logger from 'js/utils/logger'

// Make a different query for anonymous users than for
// authenticated users.
const SearchViewQuery = props => {
  const { userId, ...queryRendererProps } = props
  if (userId) {
    return (
      <QueryRenderer
        query={graphql`
          query SearchViewQuery($userId: String!) {
            app {
              ...SearchPageContainer_app
            }
            user(userId: $userId) {
              ...SearchPageContainer_user
            }
          }
        `}
        variables={{
          userId: userId,
        }}
        {...queryRendererProps}
      />
    )
  } else {
    return (
      <QueryRenderer
        query={graphql`
          query SearchViewAnonymousQuery {
            app {
              ...SearchPageContainer_app
            }
          }
        `}
        {...queryRendererProps}
      />
    )
  }
}

class SearchView extends React.Component {
  render() {
    const { userId } = this.props
    return (
      <SearchViewQuery
        userId={userId}
        environment={environment}
        render={({ error, props }) => {
          if (error) {
            logger.error(error)
          }
          if (!props) {
            props = {}
          }

          // Require the app data but allow a null user prop.
          if (!props.app) {
            return null
          }
          const user = props.user || null
          return (
            <SearchPageContainer
              app={props.app}
              user={user}
              location={this.props.location}
            />
          )
        }}
      />
    )
  }
}

SearchView.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
}

SearchView.defaultProps = {}

export default withUserId({
  renderIfNoUser: true,
})(SearchView)
