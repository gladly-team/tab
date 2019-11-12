import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import { abbreviateNumber } from 'js/utils/utils'
import TreeIcon from 'mdi-material-ui/Tree'

class TreePlantingCampaign extends React.Component {
  render() {
    const { app, user, campaign } = this.props
    const {
      recruits: { totalRecruits, recruitsWithAtLeastOneTab = {} },
    } = user
    const { time, treesPlantedGoal } = campaign
    const hasCampaignEnded = moment().isAfter(time.end)
    const treesPlantedAbbreviated = abbreviateNumber(app.campaign.numNewUsers)
    const treesPlantedGoalAbbreviated = abbreviateNumber(treesPlantedGoal)
    const progress = (100 * app.campaign.numNewUsers) / treesPlantedGoal

    // Tree icon style
    const treeStyle = {
      height: 50,
      width: 50,
    }
    const plantedTreeStyle = Object.assign({}, treeStyle, {
      color: 'green',
    })
    const incompleteTreeStyle = Object.assign({}, treeStyle, {
      color: '#BBB',
    })

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
        <Typography
          variant={'h6'}
          style={{
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          Recruit a friend, plant a tree
        </Typography>
        <div
          style={{
            margin: '14px 10px 20px',
            textAlign: 'left',
          }}
        >
          <Typography variant={'body2'} gutterBottom>
            Lorem ipsum foo bar lorem ipsum foo bar lorem ipsum foo bar lorem
            ipsum foo bar
          </Typography>
          <Typography variant={'body2'} gutterBottom>
            {recruitsWithAtLeastOneTab} trees planted
          </Typography>
          <Typography variant={'body2'} gutterBottom>
            {totalRecruits} total people recruited
          </Typography>
          <div>
            {recruitsWithAtLeastOneTab > 0 ? (
              <TreeIcon style={plantedTreeStyle} />
            ) : (
              <TreeIcon style={incompleteTreeStyle} />
            )}
            {recruitsWithAtLeastOneTab > 1 ? (
              <TreeIcon style={plantedTreeStyle} />
            ) : (
              <TreeIcon style={incompleteTreeStyle} />
            )}
            {recruitsWithAtLeastOneTab > 2 ? (
              <TreeIcon style={plantedTreeStyle} />
            ) : (
              <TreeIcon style={incompleteTreeStyle} />
            )}
          </div>
          <InviteFriend
            user={user}
            InputProps={{ style: { fontSize: 14 } }}
            helperText={"and you'll plant a tree for every person who joins!"}
          />
        </div>
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
    treesPlantedGoal: PropTypes.number.isRequired,
  }).isRequired,
}

export default TreePlantingCampaign
