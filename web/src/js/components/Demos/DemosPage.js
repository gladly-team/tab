import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Link from 'js/components/General/Link'
import Typography from '@material-ui/core/Typography'
import QueryRendererWithUser from 'js/components/General/QueryRendererWithUser'
import graphql from 'babel-plugin-relay/macro'
import logger from 'js/utils/logger'
import { replaceUrl, dashboardURL } from 'js/navigation/navigation'
import MillionRaisedCampaign from 'js/components/Campaign/MillionRaisedCampaignContainer'
import withUser from 'js/components/General/withUser'

const DAY_2020_11_04 = '2020-11-04'
const DAY_2020_11_05 = '2020-11-05'
const DAY_2020_11_06 = '2020-11-06'
const DAY_2020_11_07 = '2020-11-07'
const DAY_2020_11_08 = '2020-11-08'
const DAY_2020_11_09 = '2020-11-09' // Monday
const DAY_2020_11_10 = '2020-11-10'
const DAY_2020_11_11 = '2020-11-11'
const DAY_2020_11_12 = '2020-11-12'
const DAY_2020_11_13 = '2020-11-13'
const DAY_2020_11_14 = '2020-11-14'
const DAY_2020_11_15 = '2020-11-15'
const DAY_2020_11_16 = '2020-11-16' // Monday
const DAY_2020_11_17 = '2020-11-17'
const DAY_2020_11_18 = '2020-11-18'
const DAY_2020_11_19 = '2020-11-19'
const DAY_2020_11_20 = '2020-11-20'
const DAY_2020_11_21 = '2020-11-21'
const DAY_2020_11_22 = '2020-11-22'
const DAY_2020_11_23 = '2020-11-23'
const DAY_2020_11_24 = '2020-11-24'
const DAY_2020_11_25 = '2020-11-25'
const DAY_2020_11_26 = '2020-11-26'
const DAY_2020_11_27 = '2020-11-27'
const DAY_2020_11_28 = '2020-11-28'

const getCampaignDates = () => {
  return [
    DAY_2020_11_04,
    DAY_2020_11_05,
    DAY_2020_11_06,
    DAY_2020_11_07,
    DAY_2020_11_08,
    DAY_2020_11_09,
    DAY_2020_11_10,
    DAY_2020_11_11,
    DAY_2020_11_12,
    DAY_2020_11_13,
    DAY_2020_11_14,
    DAY_2020_11_15,
    DAY_2020_11_16,
    DAY_2020_11_17,
    DAY_2020_11_18,
    DAY_2020_11_19,
    DAY_2020_11_20,
    DAY_2020_11_21,
    DAY_2020_11_22,
    DAY_2020_11_23,
    DAY_2020_11_24,
    DAY_2020_11_25,
    DAY_2020_11_26,
    DAY_2020_11_27,
    DAY_2020_11_28,
  ]
}

const CampaignContainer = ({ children }) => {
  return <div style={{ width: 500, margin: 16 }}>{children}</div>
}

const DemosView = ({ authUser }) => {
  // This is an internal page for our team only.
  const shouldShowPage = process.env.REACT_APP_SHOW_DEMOS_PAGE === 'true'
  if (!shouldShowPage) {
    replaceUrl(dashboardURL)
    return null
  }

  const campaignOnDismiss = () => {}

  const campaignDates = getCampaignDates()

  return (
    <QueryRendererWithUser
      query={graphql`
        query DemosPageQuery($userId: String!) {
          app {
            ...MillionRaisedCampaignContainer_app
          }
          user(userId: $userId) {
            ...MillionRaisedCampaignContainer_user
          }
        }
      `}
      variables={{
        userId: authUser.id,
      }}
      render={({ error, props, retry }) => {
        if (error) {
          logger.error(error)
        }
        const { app, user } = props || {}
        return (
          <div>
            <div style={{ padding: 20 }}>
              <Typography variant="h6">Million raised campaign</Typography>
              {campaignDates.map(date => {
                return (
                  <div key={date}>
                    <Link to={`/newtab/demos/million/${date}/`}>{date}</Link>
                  </div>
                )
              })}
              <Switch>
                {campaignDates.map(date => {
                  return (
                    <Route
                      exact
                      key={date}
                      path={`/newtab/demos/million/${date}/`}
                      render={() => {
                        if (!app || !user) {
                          return null
                        }
                        return (
                          <CampaignContainer>
                            <MillionRaisedCampaign
                              app={app}
                              user={user}
                              currentDateString={date}
                              onDismiss={campaignOnDismiss}
                            />
                          </CampaignContainer>
                        )
                      }}
                    />
                  )
                })}
              </Switch>
            </div>
          </div>
        )
      }}
    />
  )
}

export default withUser()(DemosView)
