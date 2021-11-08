import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import TreeIcon from 'mdi-material-ui/PineTree'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import { abbreviateNumber } from 'js/utils/utils'
import Link from 'js/components/General/Link'
import {
  treePlantingCampaignHomepageURL,
  treePlantingCampaignCompetitionHomepageURL,
} from 'js/navigation/navigation'
import CampaignWrapper from 'js/components/Campaign/CampaignWrapper'

const Nov2021Campaign = ({ app, user, campaign, onDismiss }) => {
  const {
    recruits: { recruitsWithAtLeastOneTab = {} },
  } = user
  const { time, treesPlantedGoal } = campaign
  const hasCampaignEnded = moment().isAfter(time.end)
  const { currentNumber: numNewUsers } = app.campaign.goal
  const treesPlantedAbbreviated = abbreviateNumber(numNewUsers)
  const treesPlantedGoalAbbreviated = abbreviateNumber(treesPlantedGoal)
  const progress = (100 * numNewUsers) / treesPlantedGoal
  const treesWord = numNewUsers === 1 ? 'tree' : 'trees'

  const ACCENT_COLOR = '#028502'

  // Tree icon style
  const treeStyle = {
    height: 60,
    width: 60,
  }
  const plantedTreeStyle = Object.assign({}, treeStyle, {
    color: ACCENT_COLOR,
  })
  const incompleteTreeStyle = Object.assign({}, treeStyle, {
    color: '#BBB',
  })

  return (
    <CampaignWrapper
      onDismiss={onDismiss}
      customTheme={{ mainColor: ACCENT_COLOR, lightColor: '#94989e' }}
    >
      <Typography
        variant={'h6'}
        style={{
          textAlign: 'center',
          marginTop: 4,
        }}
      >
        {hasCampaignEnded
          ? 'Thanks for planting trees!'
          : 'Recruit a friend, plant a tree'}
      </Typography>
      <div
        style={{
          margin: '14px 10px 14px',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {hasCampaignEnded ? null : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: 8,
                }}
              >
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
                <Typography variant={'body2'} gutterBottom>
                  {recruitsWithAtLeastOneTab}/3 trees planted
                </Typography>
              </div>
            </div>
          )}
          {hasCampaignEnded ? null : (
            <div style={{ margin: 16 }}>
              <InviteFriend
                user={user}
                InputProps={{ style: { fontSize: 14 } }}
                label={'Share this link with a friend'}
                helperText={"and you'll plant a tree when they join!"}
                style={{
                  minWidth: 280,
                }}
              />
            </div>
          )}
          <div style={{ margin: 12 }}>
            {hasCampaignEnded ? (
              <>
                <Typography variant={'body2'} paragraph>
                  Thank you for joining us in planting trees with{' '}
                  <Link
                    to="https://edenprojects.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: ACCENT_COLOR }}
                  >
                    Eden Reforestation Projects
                  </Link>
                  ! Because of you,
                  <b> more than 10,000 trees will be planted</b> to combat
                  carbon sequestration, guard land erosion, provide habitat for
                  countless organisms, and provide economic resources for
                  surrounding communities!
                </Typography>
                <Typography variant={'body2'} gutterBottom={false} paragraph>
                  We loved all the creative submissions to our Tik Tok/Instagram
                  video challenge, and now it is time to decide a winner.{' '}
                  <Link
                    to="https://forms.gle/YimwK55ECcoNMYmu7"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: ACCENT_COLOR }}
                  >
                    View our top 5 submissions
                  </Link>{' '}
                  and pick your favorite content creator to receive $500 to the
                  charity of their choice! Thank you to everyone who submitted a
                  video and helped spread the word about Tab for a Cause.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant={'body2'} gutterBottom>
                  Now until January 5,{' '}
                  <Link
                    to={treePlantingCampaignHomepageURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: ACCENT_COLOR }}
                  >
                    we're planting a tree
                  </Link>{' '}
                  for every person who joins Tab for a Cause! Use TikTok/Insta?{' '}
                  <Link
                    to={treePlantingCampaignCompetitionHomepageURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: ACCENT_COLOR }}
                  >
                    Join our challenge
                  </Link>{' '}
                  and win{' '}
                  <Link
                    to={'https://shop.spreadshirt.com/tab-for-a-cause/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: ACCENT_COLOR }}
                  >
                    merch
                  </Link>{' '}
                  + $500 for your favorite charity.
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
      {hasCampaignEnded ? null : (
        <div
          style={{
            marginTop: 8,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          <div
            data-test-id={'trees-planted-progress-bar'}
            style={{
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            {hasCampaignEnded ? null : (
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant={'caption'}>
                  {treesPlantedAbbreviated} {treesWord} planted
                </Typography>
                <Typography variant={'caption'}>
                  Goal: {treesPlantedGoalAbbreviated}
                </Typography>
              </span>
            )}
            <LinearProgress
              color={'primary'}
              variant={'determinate'}
              value={progress}
            />
          </div>
          <Typography variant={'caption'}>
            <CountdownClock
              campaignStartDatetime={time.start}
              campaignEndDatetime={time.end}
            />{' '}
            remaining
          </Typography>
        </div>
      )}
    </CampaignWrapper>
  )
}

Nov2021Campaign.propTypes = {
  app: PropTypes.shape({
    campaign: PropTypes.shape({
      goal: PropTypes.shape({
        currentNumber: PropTypes.number.isRequired,
      }),
    }).isRequired,
  }),
  campaign: PropTypes.shape({
    time: PropTypes.shape({
      start: PropTypes.instanceOf(moment).isRequired,
      end: PropTypes.instanceOf(moment).isRequired,
    }),
    treesPlantedGoal: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    recruits: PropTypes.shape({
      recruitsWithAtLeastOneTab: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default Nov2021Campaign
