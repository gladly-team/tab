import React from 'react'
import PropTypes from 'prop-types'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'lodash/object'

import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import ErrorMessage from 'js/components/General/ErrorMessage'
import DashboardContainer from 'js/components/Dashboard/DashboardContainer'
import withUser from 'js/components/General/withUser'

// @nov-2021-campaign
// TODO: update (dashboard view, dashboard component, server-side)
const NOV2021_CAMPAIGN_START_TIME_ISO = '2021-11-17T16:00:00.000Z'
const NOV2021_CAMPAIGN_END_TIME_ISO = '2021-12-06T16:00:00.000Z'

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
            query DashboardViewQuery(
              $userId: String!
              # @nov-2021-campaign
              $customCampaignStartTime: String!
              $customCampaignEndTime: String!
            ) {
              app {
                ...DashboardContainer_app
              }
              user(userId: $userId) {
                ...DashboardContainer_user
                  # @nov-2021-campaign
                  @arguments(
                    startTime: $customCampaignStartTime
                    endTime: $customCampaignEndTime
                  )
              }
            }
          `}
          variables={{
            userId: authUser.id,

            // @nov-2021-campaign
            customCampaignStartTime: NOV2021_CAMPAIGN_START_TIME_ISO,
            customCampaignEndTime: NOV2021_CAMPAIGN_END_TIME_ISO,
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
