import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircleIcon from '@material-ui/icons/Lens'
import Typography from '@material-ui/core/Typography'
import theme from 'js/theme/defaultV1'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import HeartsDropdown from 'js/components/Dashboard/HeartsDropdownContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'
import SettingsDropdown from 'js/components/Dashboard/SettingsDropdownComponent'
import { logout } from 'js/authentication/user'
import {
  goTo,
  loginURL,
  searchChromeExtensionPage,
  searchFirefoxExtensionPage,
} from 'js/navigation/navigation'
import logger from 'js/utils/logger'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { inviteFriendsURL } from 'js/navigation/navigation'
import Link from 'js/components/General/Link'
import {
  CHROME_BROWSER,
  FIREFOX_BROWSER,
  TAB_APP,
  UNSUPPORTED_BROWSER,
} from 'js/constants'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import StarIcon from '@material-ui/icons/Star'
import BarChart from '@material-ui/icons/BarChart'
import VideoEngagement from 'js/components/Dashboard/VideoEngagementContainer'
import { showVideoAds } from 'js/utils/feature-flags'
import VideogameAsset from '@material-ui/icons/VideogameAsset'
const Sparkle = lazy(() => import('react-sparkle'))

const defaultTheme = createMuiTheme(theme)

const styles = theme => ({
  circleIcon: {
    alignSelf: 'center',
    width: 5,
    height: 5,
    marginTop: 2,
    marginLeft: 12,
    marginRight: 12,
  },
  treeText: {
    transition: 'color 300ms ease-in',
    fontWeight: 'normal',
    userSelect: 'none',
    cursor: 'pointer',
  },
  treeIcon: {
    transition: 'color 300ms ease-in',
    cursor: 'pointer',
    paddingBottom: 0,
    color: 'rgba(255, 255, 255, 0.8)',
  },
})

const menuFontSize = 24

class UserMenu extends React.Component {
  async logout() {
    var logoutSuccess = false
    try {
      logoutSuccess = await logout()
    } catch (e) {
      logger.error(e)
    }
    if (logoutSuccess) {
      goTo(loginURL)
    }
  }

  render() {
    const {
      app,
      browser,
      classes,
      user,
      isUserAnonymous,
      onClickLeaderboardOpen,
      onClickCampaignReopen,
      onClickSparklySearchIntroButton,
      showSparklySearchIntroButton,
      showCampaignReopenButton,
    } = this.props
    const userId = get(user, '__id', null)
    return (
      <MuiThemeProvider
        theme={{
          ...defaultTheme,
          palette: {
            ...defaultTheme.palette,
            background: {
              ...defaultTheme.palette.background,
              paper: 'rgba(0, 0, 0, 0.36)',
            },
            divider: 'rgba(255, 255, 255, 0.20)',
          },
          typography: {
            ...defaultTheme.typography,
            h2: {
              ...defaultTheme.typography.h2,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: menuFontSize,
            },
            h3: {
              ...defaultTheme.typography.h3,
              color: '#fff',
            },
            h4: {
              ...defaultTheme.typography.h4,
              color: '#fff',
            },
            h5: {
              ...defaultTheme.typography.h5,
              color: '#fff',
            },
            body2: {
              ...defaultTheme.typography.body2,
              color: '#fff',
            },
          },
          overrides: {
            ...defaultTheme.overrides,
            MuiListItemIcon: {
              ...get(defaultTheme, 'overrides.MuiListItemIcon', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiListItemIcon.root', {}),
                color: '#fff',
              },
            },
            MuiButtonBase: {
              ...get(defaultTheme, 'overrides.MuiButtonBase', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiButtonBase.root', {}),
                color: '#fff',
              },
            },
            MuiIconButton: {
              ...get(defaultTheme, 'overrides.MuiIconButton', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiIconButton.root', {}),
                color: '#fff',
              },
            },
            MuiSvgIcon: {
              ...get(defaultTheme, 'overrides.MuiSvgIcon', {}),
              root: {
                ...get(defaultTheme, 'overrides.MuiSvgIcon.root', {}),
                color: '#fff',
                fontSize: menuFontSize,
              },
            },
            MuiTypography: {
              ...get(defaultTheme, 'overrides.MuiTypography', {}),
              h2: {
                ...get(defaultTheme, 'overrides.MuiTypography.h2', {}),
                '&:hover': {
                  color: '#fff',
                },
              },
            },
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {showSparklySearchIntroButton ? (
            <div
              data-test-id={'search-intro-sparkly-button'}
              style={{ position: 'relative' }}
            >
              <Link
                to={
                  browser === CHROME_BROWSER
                    ? searchChromeExtensionPage
                    : browser === FIREFOX_BROWSER
                    ? searchFirefoxExtensionPage
                    : searchChromeExtensionPage
                }
                target={'blank'}
                onClick={onClickSparklySearchIntroButton}
              >
                <Button
                  variant={'text'}
                  color={'default'}
                  style={{
                    marginRight: 16,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Double your impact
                </Button>
              </Link>
              <ErrorBoundary ignoreErrors brand={TAB_APP}>
                <Suspense fallback={null}>
                  <Sparkle
                    color={'#FFEBA2'}
                    count={12}
                    fadeOutSpeed={34}
                    overflowPx={8}
                    flicker={false}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          ) : null}
          {showCampaignReopenButton ? (
            <>
              <div
                data-test-id={'campaign-reopen'}
                style={{
                  marginRight: 0,
                  display: 'flex',
                  flexDirection: 'row',
                }}
                onClick={onClickCampaignReopen}
              >
                <StarIcon className={classes.treeIcon} />
              </div>
              <CircleIcon
                style={{
                  marginLeft: 10,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
                classes={{
                  root: classes.circleIcon,
                }}
              />
            </>
          ) : null}
          <MoneyRaised
            app={app}
            dropdown={({ open, onClose, anchorElement }) => (
              <DashboardPopover
                open={open}
                anchorEl={anchorElement}
                onClose={onClose}
                style={{
                  marginTop: 6,
                }}
              >
                <div style={{ padding: 12, width: 160 }}>
                  <Typography
                    variant={'body2'}
                    className={classes.dropdownText}
                    gutterBottom
                  >
                    This is how much money our community has raised for charity.
                  </Typography>
                  <Typography
                    variant={'body2'}
                    className={classes.dropdownText}
                    gutterBottom
                  >
                    Recruit your friends to raise more!
                  </Typography>
                  <div
                    style={{
                      marginTop: 14,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Link to={inviteFriendsURL}>
                      <Button variant={'contained'} color={'primary'}>
                        Invite Friends
                      </Button>
                    </Link>
                  </div>
                </div>
              </DashboardPopover>
            )}
          />
          <CircleIcon
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
            }}
            classes={{
              root: classes.circleIcon,
            }}
          />
          {showVideoAds(get(user, 'email')) && (
            <>
              <VideoEngagement user={user} />
              <CircleIcon
                data-test-id={'video-ad-circle-icon'}
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
                classes={{
                  root: classes.circleIcon,
                }}
              />
            </>
          )}

          <>
            <div
              style={{
                marginRight: 0,
                display: 'flex',
                flexDirection: 'row',
              }}
              onClick={onClickLeaderboardOpen}
            >
              <BarChart className={classes.treeIcon} />
            </div>
            <CircleIcon
              style={{
                marginLeft: 10,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
              classes={{
                root: classes.circleIcon,
              }}
            />
          </>

          {userId && (
            <Link to={`https://tab.gladly.io/v5/games?user_id=${userId}`}>
              <VideogameAsset
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginRight: 16,
                }}
              />
            </Link>
          )}

          <Hearts
            app={app}
            user={user}
            showMaxHeartsFromTabsMessage
            dropdown={({ open, onClose, anchorElement }) => (
              <HeartsDropdown
                app={app}
                user={user}
                open={open}
                onClose={onClose}
                anchorElement={anchorElement}
                style={{
                  marginTop: 6,
                }}
              />
            )}
          />
          <SettingsButton
            dropdown={({ open, onClose, anchorElement }) => (
              <SettingsDropdown
                open={open}
                anchorElement={anchorElement}
                onClose={onClose}
                onLogoutClick={this.logout.bind(this)}
                isUserAnonymous={isUserAnonymous}
              />
            )}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

UserMenu.propTypes = {
  app: PropTypes.shape({}).isRequired,
  browser: PropTypes.oneOf([
    CHROME_BROWSER,
    FIREFOX_BROWSER,
    UNSUPPORTED_BROWSER,
  ]).isRequired,
  classes: PropTypes.object.isRequired,
  isUserAnonymous: PropTypes.bool,
  onClickLeaderboardOpen: PropTypes.func,
  onClickCampaignReopen: PropTypes.func,
  onClickSparklySearchIntroButton: PropTypes.func,
  showSparklySearchIntroButton: PropTypes.bool,
  user: PropTypes.shape({}).isRequired,
}

UserMenu.defaultProps = {
  isUserAnonymous: false,
  onClickLeaderboardOpen: () => {},
  onClickCampaignReopen: () => {},
  onClickSparklySearchIntroButton: () => {},
  showSparklySearchIntroButton: false,
}

export default withStyles(styles)(UserMenu)
