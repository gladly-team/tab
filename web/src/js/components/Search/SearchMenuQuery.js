import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'js/relay-env'
import SearchMenuContainer from 'js/components/Search/SearchMenuContainer'
import withUserId from 'js/components/General/withUserId'
import logger from 'js/utils/logger'

// Make a different query for anonymous users than for
// authenticated users.
const SearchMenuQueryRenderer = props => {
  const { userId, ...queryRendererProps } = props
  if (userId) {
    return (
      <QueryRenderer
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
      <QueryRenderer
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
    const { userId } = this.props
    return (
      <SearchMenuQueryRenderer
        userId={userId}
        environment={environment}
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
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
}

SearchMenuQuery.defaultProps = {}

export default withUserId({
  renderIfNoUser: true,
})(SearchMenuQuery)
