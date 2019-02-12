import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'js/relay-env'
import SearchPageContainer from 'js/components/Search/SearchPageContainer'
// import withUserId from 'js/components/General/withUserId'
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
          const app = props.app || null
          const user = props.user || null
          return (
            <SearchPageContainer
              app={app}
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

// TODO: move withUserId and QueryRenderer to children
//   so we don't slow down initial page load.
// export default withUserId({
//   renderIfNoUser: true,
// })(SearchView)
export default SearchView
