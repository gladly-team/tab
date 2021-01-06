import React from 'react'
import PropTypes from 'prop-types'
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles'
import { darken } from '@material-ui/core/styles/colorManipulator'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import theme from 'js/theme/defaultV1'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'

const defaultTheme = createMuiTheme(theme)

// A wrapper for custom campaigns to handle styling and
// closing functionality.

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    pointerEvents: 'none',
  },
  paper: {
    position: 'relative',
    pointerEvents: 'all',
    minWidth: 400,
    width: '100%',
    margin: 0,
    padding: 0,
    background: '#FFF',
    border: 'none',
  },
  borderTop: {
    width: '100%',
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: theme.palette.secondary.main,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 2,
  },
  campaignContent: {
    padding: 12,
  },
})

const CampaignWrapper = ({
  children,
  classes,
  customTheme = {},
  onDismiss,
}) => {
  const { mainColor, lightColor } = customTheme
  return (
    <MuiThemeProvider
      theme={{
        ...defaultTheme,
        palette: {
          ...defaultTheme.palette,
          primary: {
            ...defaultTheme.palette.primary,
            ...(mainColor && {
              main: mainColor,
              dark: darken(mainColor, 0.15),
            }),
            ...(lightColor && { light: lightColor }),
          },
          secondary: {
            ...defaultTheme.palette.secondary,
            ...(mainColor && {
              main: mainColor,
              dark: darken(mainColor, 0.15),
            }),
            ...(lightColor && { light: lightColor }),
          },
        },
      }}
    >
      <div className={classes.root}>
        <Paper elevation={1} className={classes.paper}>
          <div
            className={classes.borderTop}
            style={{
              backgroundColor: mainColor || defaultTheme.palette.secondary,
            }}
          />
          <IconButton
            onClick={() => {
              setCampaignDismissTime()
              onDismiss()
            }}
            className={classes.closeButton}
          >
            <CloseIcon />
          </IconButton>
          <div className={classes.campaignContent}>{children}</div>
        </Paper>
      </div>
    </MuiThemeProvider>
  )
}

CampaignWrapper.defaultProps = {
  onDismiss: () => {},
}

CampaignWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(CampaignWrapper)
