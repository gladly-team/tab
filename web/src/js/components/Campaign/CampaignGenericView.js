import React from 'react'
import PropTypes from 'prop-types'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import withUser from 'js/components/General/withUser'
import CampaignBase from 'js/components/Campaign/CampaignBase'
import logger from 'js/utils/logger'

// This is an alternative approach to using CampaignGenericView.
// This component aims to only rely on the API for content.
class CampaignGenericView extends React.Component {
  render() {
    const { authUser } = this.props
    const userId = authUser ? authUser.id : null

    return (
      <QueryRendererWithUser
        query={graphql`
          query CampaignGenericViewQuery($userId: String!) {
            app {
              campaign {
                isLive
                charity {
                  ...DonateHeartsControlsContainer_charity
                }
              }
            }
            user(userId: $userId) {
              ...DonateHeartsControlsContainer_user
            }
          }
        `}
        variables={{
          userId: userId,
        }}
        render={({ error, props, retry }) => {
          if (error) {
            logger.error(error)
          }
          if (!props) {
            return null
          }
          const { app, user } = props

          // Mock data we need for the campaign to function.
          // This should come from the API.
          app.campaign = {
            isLive: true,
            campaignId: 'mock-id',
            time: {
              start: '2020-03-25T18:00:00.000Z',
              end: '2020-05-01T18:00:00.000Z',
            },
            content: {
              title: 'Hi there!',
              description: 'Here is some content :)',
            },
            endContent: {
              title: '',
              description: '',
            },
            goal: {
              showProgressBar: true,
              goalNumber: 6e4,
              currentNumber: 220032,
              goalWordSingular: 'meal',
              goalWordPlural: 'meals',
            },
            numNewUsers: undefined, // probably want to roll into generic goal
            showCountdownTimer: true,
            showHeartsDonationButton: true,
          }

          return <CampaignBase app={app} user={user} {...this.props} />
        }}
      />
    )
  }
}

CampaignGenericView.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string,
    username: PropTypes.string,
    isAnonymous: PropTypes.bool,
    emailVerified: PropTypes.bool,
  }).isRequired,
}
CampaignGenericView.defaultProps = {}

export default withUser({ redirectToAuthIfIncomplete: false })(
  CampaignGenericView
)
