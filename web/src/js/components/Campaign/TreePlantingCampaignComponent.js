import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import { abbreviateNumber } from 'js/utils/utils'

class TreePlantingCampaign extends React.Component {
  render() {
    const { app, user, campaign, children, showError } = this.props
    const { time, endContent, treesPlantedGoal } = campaign
    const hasCampaignEnded = moment().isAfter(time.end)
    const treesPlantedAbbreviated = abbreviateNumber(app.campaign.numNewUsers)
    const treesPlantedGoalAbbreviated = abbreviateNumber(treesPlantedGoal)
    const progress = (100 * app.campaign.numNewUsers) / treesPlantedGoal
    return (
      <div
        style={{
          width: 480,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        {' '}
        {hasCampaignEnded && endContent ? endContent : children}
        <div
          style={{
            marginTop: 8,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            {hasCampaignEnded ? (
              <Typography variant={'caption'} gutterBottom>
                Great job! Together, we planted {treesPlantedAbbreviated} trees
                of our {treesPlantedGoalAbbreviated} goal.
              </Typography>
            ) : null}
            {hasCampaignEnded ? null : (
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant={'caption'}>
                  {treesPlantedAbbreviated} trees planted
                </Typography>
                <Typography variant={'caption'}>
                  Goal: {treesPlantedGoalAbbreviated}
                </Typography>
              </span>
            )}
            <LinearProgress variant="determinate" value={progress} />
          </div>
          <Typography variant={'caption'}>
            <CountdownClock
              campaignStartDatetime={time.start}
              campaignEndDatetime={time.end}
            />{' '}
            remaining
          </Typography>
        </div>
      </div>
    )
  }
}

TreePlantingCampaign.propTypes = {
  app: PropTypes.shape({
    campaign: PropTypes.shape({
      numNewUsers: PropTypes.number.isRequired,
    }).isRequired,
  }),
  user: PropTypes.shape({
    recruits: PropTypes.shape({
      totalRecruits: PropTypes.number.isRequired, // TODO: probably remove
      recruitsActiveForAtLeastOneDay: PropTypes.number.isRequired, // TODO: probably remove
      recruitsWithAtLeastOneTab: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  campaign: PropTypes.shape({
    time: PropTypes.shape({
      start: PropTypes.instanceOf(moment).isRequired,
      end: PropTypes.instanceOf(moment).isRequired,
    }),
    endContent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    treesPlantedGoal: PropTypes.number.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  showError: PropTypes.func.isRequired,
}

export default TreePlantingCampaign
