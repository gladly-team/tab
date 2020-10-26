import React from 'react'
// import PropTypes from 'prop-types'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import withUser from 'js/components/General/withUser'
import MillionRaisedCampaign from 'js/components/Campaign/MillionRaisedCampaign'
import logger from 'js/utils/logger'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'

class MillionRaisedCampaignView extends React.Component {
  render() {
    const { currentDateString, onDismiss } = this.props

    return (
      <QueryRendererWithUser
        query={graphql`
          query MillionRaisedCampaignViewQuery {
            app {
              ...MoneyRaisedGenericContainer_app
            }
          }
        `}
        render={({ error, props, retry }) => {
          if (error) {
            logger.error(error)
          }
          if (!props) {
            return null
          }
          const { app } = props
          if (!app) {
            return null
          }

          return (
            <FadeInDashboardAnimation>
              <MillionRaisedCampaign
                app={app}
                currentDateString={currentDateString}
                onDismiss={onDismiss}
              />
            </FadeInDashboardAnimation>
          )
        }}
      />
    )
  }
}

MillionRaisedCampaignView.propTypes = {}
MillionRaisedCampaignView.defaultProps = {}

export default withUser({ redirectToAuthIfIncomplete: false })(
  MillionRaisedCampaignView
)
