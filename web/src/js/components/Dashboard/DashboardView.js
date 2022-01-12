import React from 'react'
import PropTypes from 'prop-types'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'lodash/object'

import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import ErrorMessage from 'js/components/General/ErrorMessage'
import DashboardContainer from 'js/components/Dashboard/DashboardContainer'
import withUser from 'js/components/General/withUser'

class DashboardView extends React.Component {
  render() {
    const { authUser } = this.props
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <QueryRendererWithUser
          query={graphql`
            query DashboardViewQuery($userId: String!) {
              app {
                ...DashboardContainer_app
              }
              user(userId: $userId) {
                ...DashboardContainer_user
              }
            }
          `}
          variables={{
            userId: authUser.id,
          }}
          render={({ error, props, retry }) => {
            if (error && get(error, 'source.errors')) {
              const errMsg = 'We had a problem loading your dashboard :('
              return <ErrorMessage message={errMsg} />
            }
            if (!props) {
              props = {}
            }
            const app = props.app || null
            const user = props.user || null
            return <DashboardContainer app={app} user={user} />
          }}
        />
      </div>
    )
  }
}

DashboardView.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

DashboardView.defaultProps = {}

export default withUser()(DashboardView)
