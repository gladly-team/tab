import React from 'react'
import PropTypes from 'prop-types'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import SearchMenuContainer from 'js/components/Search/SearchMenuContainer'
import withUser from 'js/components/General/withUser'
import logger from 'js/utils/logger'
import { SEARCH_APP } from 'js/constants'

// Make a different query for anonymous users than for
// authenticated users.
const SearchMenuQueryRenderer = props => {
  const { userId, ...queryRendererProps } = props
  if (userId) {
    return (
      <QueryRendererWithUser
        query={graphql`
          query SearchMenuQuery($userId: String!) {
            app {
              ...SearchMenuContainer_app
            }
            user(userId: $userId) {
              ...SearchMenuContainer_user
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
      <QueryRendererWithUser
        query={graphql`
          query SearchMenuQueryAnonymousQuery {
            app {
              ...SearchMenuContainer_app
            }
          }
        `}
        {...queryRendererProps}
      />
    )
  }
}

class SearchMenuQuery extends React.Component {
  render() {
    const { authUser } = this.props
    const userId = authUser ? authUser.id : null
    return (
      <SearchMenuQueryRenderer
        userId={userId}
        render={({ error, props }) => {
          if (error) {
            logger.error(error)
          }
          if (!(props && props.app)) {
            return
          }
          return (
            <SearchMenuContainer
              {...this.props}
              app={props.app}
              user={props.user || null}
              location={this.props.location}
            />
          )
        }}
      />
    )
  }
}

SearchMenuQuery.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    isAnonymous: PropTypes.bool,
    emailVerified: PropTypes.bool,
  }),
  isSearchExtensionInstalled: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
}

SearchMenuQuery.defaultProps = {
  isSearchExtensionInstalled: true,
}

export default withUser({
  app: SEARCH_APP,
  createUserIfPossible: false,
  redirectToAuthIfIncomplete: false,
  renderIfNoUser: true,
})(SearchMenuQuery)
