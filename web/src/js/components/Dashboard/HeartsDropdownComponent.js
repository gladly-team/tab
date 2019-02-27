import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import { commaFormatted } from 'js/utils/utils'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { inviteFriendsURL, donateURL } from 'js/navigation/navigation'
import Link from 'js/components/General/Link'

const styles = {}

const HeartsDropdownComponent = props => {
  const { anchorElement, app, onClose, open, user } = props
  const sectionStyle = {
    paddingTop: 12,
    paddingBottom: 20,
  }
  const buttonStyle = {
    marginTop: 8,
    marginBottom: 0,
  }
  return (
    <DashboardPopover open={open} anchorEl={anchorElement} onClose={onClose}>
      <div
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          width: 210,
          textAlign: 'center',
        }}
      >
        <div style={sectionStyle}>
          <Typography variant={'h5'}>Level {user.level}</Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant={'body2'}>
              {user.heartsUntilNextLevel}
            </Typography>
            <HeartBorderIcon
              style={{
                height: 16,
              }}
            />
            <Typography variant={'body2'}> until next level</Typography>
          </div>
        </div>
        <Divider />
        <div style={sectionStyle}>
          <span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant={'h5'}>
                {commaFormatted(user.vcDonatedAllTime)}
              </Typography>
              <HeartBorderIcon
                style={{
                  marginLeft: 2,
                  height: 24,
                  width: 24,
                  paddingBottom: 1,
                }}
              />
            </span>
            <Typography variant={'body2'}>donated</Typography>
          </span>
          <Link to={donateURL}>
            <Button variant={'contained'} color={'primary'} style={buttonStyle}>
              Donate Hearts
            </Button>
          </Link>
        </div>
        <Divider />
        <div style={sectionStyle}>
          <div>
            <Typography variant={'h5'}>{user.numUsersRecruited}</Typography>
            <Typography variant={'body2'}>Tabbers recruited</Typography>
          </div>
          <Link to={inviteFriendsURL}>
            <Button variant={'contained'} color={'primary'} style={buttonStyle}>
              Invite A Friend
            </Button>
          </Link>
        </div>
        <Divider />
        <div
          style={{
            paddingTop: 12,
            paddingLeft: 22,
            paddingRight: 22,
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex' }}>
            <Typography
              variant={'body2'}
              style={{
                flex: 6,
              }}
            >
              Open a tab
            </Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant={'body2'} style={{ textAlign: 'right' }}>
                1
              </Typography>
              <HeartBorderIcon
                style={{
                  height: 16,
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <Typography
              variant={'body2'}
              style={{
                flex: 6,
              }}
            >
              Recruit a friend
            </Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant={'body2'} style={{ textAlign: 'right' }}>
                {app.referralVcReward}
              </Typography>
              <HeartBorderIcon
                style={{
                  height: 16,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardPopover>
  )
}

HeartsDropdownComponent.displayName = 'HeartsDropdownComponent'

HeartsDropdownComponent.propTypes = {
  anchorElement: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  app: PropTypes.shape({
    referralVcReward: PropTypes.number.isRequired,
  }),
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    vcCurrent: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    heartsUntilNextLevel: PropTypes.number.isRequired,
    vcDonatedAllTime: PropTypes.number.isRequired,
    numUsersRecruited: PropTypes.number.isRequired,
    tabsToday: PropTypes.number.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

HeartsDropdownComponent.defaultProps = {
  open: false,
}

export default withStyles(styles)(HeartsDropdownComponent)
