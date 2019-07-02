import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles'
import CircleIcon from '@material-ui/icons/Lens'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import theme from 'js/theme/searchTheme'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Search/SearchHeartsContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'

const defaultTheme = createMuiTheme(theme)

const styles = {
  circleIcon: {
    alignSelf: 'center',
    width: 5,
    height: 5,
    marginTop: 2,
    marginLeft: 12,
    marginRight: 12,
  },
}

const menuFontSize = 22

const SearchMenuComponent = props => {
  const { app, classes, showIntroMessage, style, user } = props
  const userExists = !!user
  return (
    <MuiThemeProvider
      theme={{
        ...defaultTheme,
        typography: {
          ...defaultTheme.typography,
          h2: {
            ...defaultTheme.typography.h2,
            color: 'rgba(0, 0, 0, 0.66)',
            fontSize: menuFontSize,
          },
        },
        overrides: {
          MuiSvgIcon: {
            ...get(defaultTheme, 'overrides.MuiSvgIcon', {}),
            root: {
              ...get(defaultTheme, 'overrides.MuiSvgIcon.root', {}),
              color: 'rgba(0, 0, 0, 0.66)',
              fontSize: menuFontSize,
            },
          },
          MuiTypography: {
            ...get(defaultTheme, 'overrides.MuiTypography', {}),
            h2: {
              ...get(defaultTheme, 'overrides.MuiTypography.h2', {}),
              '&:hover': {
                color: 'rgba(0, 0, 0, 0.87)',
              },
            },
          },
        },
      }}
    >
      <div
        style={Object.assign(
          {
            display: 'flex',
            alignItems: 'center',
          },
          style
        )}
      >
        <div style={{ position: 'relative' }}>
          <MoneyRaised app={app} />
          {showIntroMessage ? (
            <Paper
              data-test-id={'search-intro-msg'}
              elevation={1}
              style={{
                position: 'absolute',
                top: 40,
                right: 0,
                width: 400,
                boxSizing: 'border-box',
                padding: '10px 18px',
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Typography
                  variant={'h6'}
                  style={{ marginTop: 8, marginBottom: 8 }}
                >
                  Your searches do good :)
                </Typography>
                <Typography variant={'body2'}>
                  When you search, you raise money for charity! The money comes
                  from the ads in search results, and you decide where the money
                  goes by donating your Hearts to your favorite nonprofit.
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    alignSelf: 'flex-end',
                    marginTop: 10,
                  }}
                >
                  <Button
                    color={'primary'}
                    variant={'contained'}
                    // onClick={() => {
                    //   setUserDismissedSearchIntro()
                    //   this.setState({
                    //     showIntroMessage: false,
                    //   })
                    // }}
                  >
                    Great!
                  </Button>
                </div>
              </span>
            </Paper>
          ) : null}
        </div>
        {userExists ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CircleIcon
              style={{
                color: 'rgba(0, 0, 0, 0.66)',
              }}
              classes={{
                root: classes.circleIcon,
              }}
            />
            <Hearts app={app} user={user} showMaxHeartsFromSearchesMessage />
            <SettingsButton isUserAnonymous={false} />
          </div>
        ) : null}
      </div>
    </MuiThemeProvider>
  )
}

SearchMenuComponent.displayName = 'SearchMenuComponent'

SearchMenuComponent.propTypes = {
  app: PropTypes.shape({}).isRequired,
  classes: PropTypes.object.isRequired,
  style: PropTypes.object,
  // May not exist if the user is not signed in.
  user: PropTypes.shape({}),
  showIntroMessage: PropTypes.bool.isRequired,
}

SearchMenuComponent.defaultProps = {
  showIntroMessage: false,
  style: {},
}

export default withStyles(styles)(SearchMenuComponent)
