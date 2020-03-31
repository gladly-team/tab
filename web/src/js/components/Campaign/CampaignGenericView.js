import React from 'react'
import PropTypes from 'prop-types'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import withUser from 'js/components/General/withUser'
import CampaignGeneric from 'js/components/Campaign/CampaignGenericComponent'
import logger from 'js/utils/logger'

// This is an alternative approach to using CampaignGenericView.
// This component aims to only rely on the API for content.
class CampaignGenericView extends React.Component {
  render() {
    const { authUser, onDismiss, showError } = this.props
    const userId = authUser ? authUser.id : null

    return (
      <QueryRendererWithUser
        query={graphql`
          query CampaignGenericViewQuery($userId: String!) {
            app {
              campaign {
                charity {
                  id
                  image
                  imageCaption
                  impact
                  name
                  website
                  ...DonateHeartsControlsContainer_charity
                }
                content {
                  titleMarkdown
                  descriptionMarkdown
                }
                endContent {
                  titleMarkdown
                  descriptionMarkdown
                }
                goal {
                  targetNumber
                  currentNumber
                  impactUnitSingular
                  impactUnitPlural
                  impactVerbPastTense
                }
                isLive
                showCountdownTimer
                showHeartsDonationButton
                showProgressBar
                time {
                  start
                  end
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

          return (
            <CampaignGeneric
              app={app}
              user={user}
              onDismiss={onDismiss}
              showError={showError}
            />
          )
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
  showError: PropTypes.func.isRequired,
}
CampaignGenericView.defaultProps = {}

export default withUser({ redirectToAuthIfIncomplete: false })(
  CampaignGenericView
)
