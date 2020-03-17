import React from 'react'
import PropTypes from 'prop-types'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import withUser from 'js/components/General/withUser'
import CampaignBase from 'js/components/Campaign/CampaignBase'
import logger from 'js/utils/logger'

class CampaignBaseView extends React.Component {
  render() {
    const { authUser } = this.props
    const userId = authUser ? authUser.id : null

    // Note: currently, we need to hardcode campaign start and end times
    // both here and server side.
    const CAMPAIGN_START_TIME_ISO = '2020-03-17T18:00:00.000Z'
    const CAMPAIGN_END_TIME_ISO = '2020-05-01T18:00:00.000Z'
    const CHARITY_ID = '6667eb86-ea37-4d3d-9259-910bea0b5e38'

    return (
      <QueryRendererWithUser
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
          charityId: CHARITY_ID,
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

CampaignBaseView.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string,
    username: PropTypes.string,
    isAnonymous: PropTypes.bool,
    emailVerified: PropTypes.bool,
  }).isRequired,
}
CampaignBaseView.defaultProps = {}

export default withUser({ redirectToAuthIfIncomplete: false })(CampaignBaseView)
