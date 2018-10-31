/* global graphql */

import React from 'react'
import { QueryRenderer } from 'react-relay'
import environment from 'js/relay-env'
import AuthUserComponent from 'js/components/General/AuthUserComponent'
import SearchContainer from 'js/components/Search/SearchContainer'

class SearchView extends React.Component {
  render () {
    return (
      <AuthUserComponent>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query SearchViewQuery($userId: String!) {
              app {
                ...SearchContainer_app
              }
              user(userId: $userId) {
                ...SearchContainer_user
              }
            }
          `}
          render={({ error, props }) => {
            if (error) {
              console.error(error)
            }
            if (!props) {
              props = {}
            }
            const app = props.app || null
            const user = props.user || null
            return (
              <SearchContainer
                app={app}
                user={user}
                location={this.props.location}
              />
            )
          }} />
      </AuthUserComponent>
    )
  }
}

export default SearchView
