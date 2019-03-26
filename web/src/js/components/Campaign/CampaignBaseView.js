import React from 'react'
// import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'js/relay-env'
import withUserId from 'js/components/General/withUserId'
import CampaignBase from 'js/components/Campaign/CampaignBase'
import logger from 'js/utils/logger'

class CampaignBaseView extends React.Component {
  render() {
    const { userId } = this.props
    const CAMPAIGN_START_TIME_ISO = '2019-03-26T20:00:00.000Z'
    const CAMPAIGN_END_TIME_ISO = '2019-03-29T20:00:00.000Z'

    return (
      <QueryRenderer
        environment={environment}
        // Hardcode campaign-specific data requirements here, and remove
        // after the campaign is no longer live.
        query={graphql`
          query CampaignBaseViewQuery(
            $userId: String!
            $charityId: String!
            $startTime: String!
            $endTime: String!
          ) {
            app {
              ...HeartDonationCampaignContainer_app
                @arguments(startTime: $startTime, endTime: $endTime)
            }
            user(userId: $userId) {
              ...HeartDonationCampaignContainer_user
            }
          }
        `}
        variables={{
          userId: userId,
          charityId: '3e47df5d-1a1e-432b-8d81-12dc5453563e',
          startTime: CAMPAIGN_START_TIME_ISO,
          endTime: CAMPAIGN_END_TIME_ISO,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            logger.error(error)
          }
          if (!props) {
            return null
          }
          const { app, user } = props
          return (
            <CampaignBase
              app={app}
              user={user}
              campaignStartTimeISO={CAMPAIGN_START_TIME_ISO}
              campaignEndTimeISO={CAMPAIGN_END_TIME_ISO}
              {...this.props}
            />
          )
        }}
      />
    )
  }
}

CampaignBaseView.propTypes = {}
CampaignBaseView.defaultProps = {}

export default withUserId()(CampaignBaseView)
