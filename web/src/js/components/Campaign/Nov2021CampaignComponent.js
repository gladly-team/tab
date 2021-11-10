import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import AppleIcon from 'mdi-material-ui/Apple'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import { abbreviateNumber, commaFormatted } from 'js/utils/utils'
import Link from 'js/components/General/Link'
import CampaignWrapper from 'js/components/Campaign/CampaignWrapper'

const Nov2021Campaign = ({ app, user, campaign, onDismiss }) => {
  const {
    recruits: { recruitsWithAtLeastOneTab = {} },
  } = user
  const { time, goal } = campaign
  const hasCampaignEnded = moment().isAfter(time.end)
  // const hasCampaignEnded = true
  const { currentNumber: numNewUsers } = app.campaign.goal
  const progressNumAbbreviated = abbreviateNumber(numNewUsers)
  const progressNumCommaFormatted = commaFormatted(numNewUsers)
  const goalNumAbbreviated = abbreviateNumber(goal)
  const progress = (100 * numNewUsers) / goal
  const kidsWord = numNewUsers === 1 ? 'kid' : 'kids'

  const ACCENT_COLOR = '#C41E3A'
  const goalIconStyle = {
    height: 60,
    width: 60,
  }
  const completedGoalStyle = Object.assign({}, goalIconStyle, {
    color: ACCENT_COLOR,
  })
  const incompletedGoalStyle = Object.assign({}, goalIconStyle, {
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
          ? 'Thank you for keeping kids fed!'
          : 'Recruit a friend, feed 10 children in need'}
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
                    <AppleIcon style={completedGoalStyle} />
                  ) : (
                    <AppleIcon style={incompletedGoalStyle} />
                  )}
                  {recruitsWithAtLeastOneTab > 1 ? (
                    <AppleIcon style={completedGoalStyle} />
                  ) : (
                    <AppleIcon style={incompletedGoalStyle} />
                  )}
                  {recruitsWithAtLeastOneTab > 2 ? (
                    <AppleIcon style={completedGoalStyle} />
                  ) : (
                    <AppleIcon style={incompletedGoalStyle} />
                  )}
                </div>
                <Typography variant={'body2'} gutterBottom>
                  {recruitsWithAtLeastOneTab * 10}/30 kids fed
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
                helperText={"and you'll feed 10 kids when they join!"}
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
                  Thank you for joining us in keeping kids fed through{' '}
                  <Link
                    to="https://www.nokidhungry.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: ACCENT_COLOR }}
                  >
                    No Kid Hungry
                  </Link>
                  ! Together,{' '}
                  <b>
                    our community provided {progressNumCommaFormatted} meals to
                    kids in need.
                  </b>{' '}
                  Each meal handed out works to ensure all children have the
                  opportunity to grow up strong, happy, and healthy.
                </Typography>
                <Typography variant={'body2'} paragraph>
                  Your help was critical: rather than spending our marketing
                  budget on ads, we’re able to turn it into thousands of meals
                  for kids, thanks to you.
                </Typography>
                <Typography variant={'body2'} gutterBottom={false}>
                  Happy holidays & happy tabbing!
                </Typography>
              </>
            ) : (
              <>
                <Typography variant={'body2'} paragraph>
                  Every child needs three meals a day to grow up strong, happy,
                  and healthy. With{' '}
                  <Link
                    to="https://www.nokidhungry.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: ACCENT_COLOR }}
                  >
                    No Kid Hungry
                  </Link>
                  , this can be a reality thanks to their school and early
                  childhood meal programs.
                </Typography>
                <Typography variant={'body2'} paragraph>
                  Now until December 6,{' '}
                  <b>
                    we're feeding 10 children for every person you recruit to
                    Tab for a Cause!
                  </b>{' '}
                  Quadruple your impact by getting at least 3 friends on board
                  today. ❤️
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 8,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        <div
          data-test-id={'custom-campaign-progress-bar'}
          style={{
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant={'caption'}>
              {progressNumAbbreviated} {kidsWord} fed
            </Typography>
            <Typography variant={'caption'}>
              Goal: {goalNumAbbreviated}
            </Typography>
          </span>
          <LinearProgress
            color={'primary'}
            variant={'determinate'}
            value={progress}
          />
        </div>
        {hasCampaignEnded ? null : (
          <Typography variant={'caption'}>
            <CountdownClock
              campaignStartDatetime={time.start}
              campaignEndDatetime={time.end}
            />{' '}
            remaining
          </Typography>
        )}
      </div>
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
    goal: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    recruits: PropTypes.shape({
      recruitsWithAtLeastOneTab: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default Nov2021Campaign
