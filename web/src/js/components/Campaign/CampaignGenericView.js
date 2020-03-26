import React from 'react'
import PropTypes from 'prop-types'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import withUser from 'js/components/General/withUser'
import CampaignGeneric from 'js/components/Campaign/CampaignGenericComponent'
import logger from 'js/utils/logger'

const campaignTitle = '## COVID-19 Solidarity'

const campaignDescription = `
#### The spread of COVID-19 has been swift and destructive. We need a global response to support the health systems working to keep us all safe. As a free, simple, and at-home way to raise money for important causes, we will be running a special campaign for the foreseeable future to raise funds for the response efforts.

#### Donate your hearts to the COVID-19 solidarity fund and support the [World Health Organization](https://www.who.int/) and their partners in a massive effort to help countries prevent, detect, and manage the novel coronavirus—particularly where the needs are the greatest.

#### Join us in supporting the [COVID-19 Solidarity Response Fund](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate).
`

const campaignEndTitle = '## Thank You for Supporting the WHO'

const campaignEndDescription = `
#### With your help, the World Health Organization will continue to provide COVID-19 relief, prevention, and detection.
`

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
          const campaign = {
            isLive: true,
            campaignId: 'mock-id',
            time: {
              start: '2020-03-25T18:00:00.000Z',
              // end: '2020-05-01T18:00:00.000Z',
              end: '2020-03-26T00:00:00.000Z',
            },
            // Maybe use markdown:
            // https://github.com/mui-org/material-ui/issues/12290#issuecomment-453930042
            content: {
              titleMarkdown: campaignTitle,
              descriptionMarkdown: campaignDescription,
            },
            endContent: {
              titleMarkdown: campaignEndTitle,
              descriptionMarkdown: campaignEndDescription,
            },
            goal: {
              goalNumber: 10e6,
              currentNumber: 16.6e6,
              goalWordSingular: 'Heart',
              goalWordPlural: 'Hearts',
            },
            numNewUsers: undefined, // probably want to roll into generic goal
            showCountdownTimer: false,
            showHeartsDonationButton: true,
            showProgressBar: true,
            charity: {
              id:
                'Q2hhcml0eTo2NjY3ZWI4Ni1lYTM3LTRkM2QtOTI1OS05MTBiZWEwYjVlMzg=',
              image:
                'https://prod-tab2017-media.gladly.io/img/charities/charity-post-donation-images/covid-19-solidarity.jpg',
              imageCaption: null,
              impact:
                'With your help, the World Health Organization will continue to provide COVID-19 relief, prevention, and detection.',
              name: 'COVID-19 Solidarity Response Fund',
              vcReceived: 16474011,
              website:
                'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate',
            },
          }

          return (
            <CampaignGeneric
              campaign={campaign}
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
