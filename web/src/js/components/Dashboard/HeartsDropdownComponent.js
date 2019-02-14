import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { inviteFriendsURL, donateURL } from 'js/navigation/navigation'
import Link from 'js/components/General/Link'

// TODO: break out to make the component customizable:
// https://material-ui.com/customization/overrides/#3-specific-variation-of-a-component
const styles = {
  typographyRoot: {
    color: 'white',
  },
  dividerRoot: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
  },
  heartIconRoot: {
    color: 'white',
  },
}

const HeartsDropdownComponent = props => {
  const { anchorElement, app, classes, onClose, open, user } = props
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
          <Typography
            classes={{
              root: classes.typographyRoot,
            }}
            variant={'h5'}
            color={'primary'}
          >
            Level {user.level}
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              classes={{
                root: classes.typographyRoot,
              }}
              variant={'body2'}
            >
              {user.heartsUntilNextLevel}
            </Typography>
            <HeartBorderIcon
              classes={{
                root: classes.heartIconRoot,
              }}
              style={{
                height: 16,
              }}
            />
            <Typography
              classes={{
                root: classes.typographyRoot,
              }}
              variant={'body2'}
            >
              {' '}
              until next level
            </Typography>
          </div>
        </div>
        <Divider classes={{ root: classes.dividerRoot }} />
        <div style={sectionStyle}>
          <span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                classes={{
                  root: classes.typographyRoot,
                }}
                variant={'h5'}
              >
                {user.vcDonatedAllTime}
              </Typography>
              <HeartBorderIcon
                classes={{
                  root: classes.heartIconRoot,
                }}
                style={{
                  marginLeft: 2,
                  height: 24,
                  width: 24,
                  paddingBottom: 1,
                }}
              />
            </span>
            <Typography
              classes={{
                root: classes.typographyRoot,
              }}
              variant={'body2'}
            >
              donated
            </Typography>
          </span>
          <Link to={donateURL}>
            <Button variant={'contained'} color={'primary'} style={buttonStyle}>
              Donate Hearts
            </Button>
          </Link>
        </div>
        <Divider classes={{ root: classes.dividerRoot }} />
        <div style={sectionStyle}>
          <div>
            <Typography
              classes={{
                root: classes.typographyRoot,
              }}
              variant={'h5'}
            >
              {user.numUsersRecruited}
            </Typography>
            <Typography
              classes={{
                root: classes.typographyRoot,
              }}
              variant={'body2'}
            >
              Tabbers recruited
            </Typography>
          </div>
          <Link to={inviteFriendsURL}>
            <Button variant={'contained'} color={'primary'} style={buttonStyle}>
              Invite A Friend
            </Button>
          </Link>
        </div>
        <Divider classes={{ root: classes.dividerRoot }} />
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
              classes={{
                root: classes.typographyRoot,
              }}
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
              <Typography
                classes={{
                  root: classes.typographyRoot,
                }}
                variant={'body2'}
                style={{ textAlign: 'right' }}
              >
                1
              </Typography>
              <HeartBorderIcon
                classes={{
                  root: classes.heartIconRoot,
                }}
                style={{
                  height: 16,
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <Typography
              classes={{
                root: classes.typographyRoot,
              }}
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
              <Typography
                classes={{
                  root: classes.typographyRoot,
                }}
                variant={'body2'}
                style={{ textAlign: 'right' }}
              >
                {app.referralVcReward}
              </Typography>
              <HeartBorderIcon
                classes={{
                  root: classes.heartIconRoot,
                }}
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
