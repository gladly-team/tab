import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'
import {
  millionRaisedURL,
  instagramPageURL,
  twitterPageURL,
} from 'js/navigation/navigation'
import useMoneyRaised from 'js/utils/hooks/useMoneyRaised'

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
  campaignAddendum: {
    background: '#f5f5f5', // darker: '#eeeeee'
    padding: 12,
  },
  mainTextContainer: {},
  title: {
    textAlign: 'center',
  },
  moneyRaised: {
    color: theme.palette.secondary.main,
  },
  description: {
    margin: 14,
    textAlign: 'left',
  },
  link: {
    color: theme.palette.primary.main,
  },
  hashtag: {
    background: theme.palette.secondary.main,
    padding: '2px 14px',
    borderRadius: 3,
    display: 'inline-block',
    marginBottom: 10,
  },
  hashtagText: {
    color: 'white',
  },
  addendumButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
})

const DAY_2020_10_29 = '2020-10-29'
const DAY_2020_10_30 = '2020-10-30'
const DAY_2020_10_31 = '2020-10-31'
const DAY_2020_11_01 = '2020-11-01'
const DAY_2020_11_02 = '2020-11-02' // Monday
const DAY_2020_11_03 = '2020-11-03'
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

const getCampaignContent = ({
  app,
  classes,
  currentDateString,
  moneyRaisedUSDString,
}) => {
  const defaultTitle = (
    <Typography variant="h6">A tab you'll want to keep open:</Typography>
  )
  const moneyRaisedDisplay = (
    <Typography variant="h2" align={'center'} gutterBottom>
      <span className={classes.moneyRaised}>{moneyRaisedUSDString}</span>
    </Typography>
  )
  const defaultMainContent = (
    <div>
      {moneyRaisedDisplay}
      <Typography variant="body2">
        We couldn't be more excited that we are about to hit{' '}
        <span style={{ fontWeight: 'bold' }}>a million dollars</span> raised!
        Never underestimate the power of a small group working together for
        positive change.{' '}
        <Link
          to={millionRaisedURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
        >
          See what we've accomplished together
        </Link>
      </Typography>
    </div>
  )
  const defaultAddendumContent = (
    <div>
      <div className={classes.hashtag}>
        <Typography variant="subtitle2" className={classes.hashtagText}>
          #TabForAMillion
        </Typography>
      </div>
      <Typography variant="body2" gutterBottom>
        <span style={{ fontWeight: 'bold' }}>What you can do today:</span> check
        out{' '}
        <Link
          to={millionRaisedURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
        >
          the real-world good your tabs have turned into here
        </Link>
        ! Share the achievement you're proudest of.
      </Typography>
    </div>
  )

  let title = defaultTitle
  let mainContent = defaultMainContent
  let addendumContent = defaultAddendumContent
  switch (currentDateString) {
    case DAY_2020_10_29: {
      break
    }
    case DAY_2020_10_30: {
      mainContent = (
        <div>
          {moneyRaisedDisplay}
          <Typography variant="body2">Some description here</Typography>
        </div>
      )
      addendumContent = (
        <div>
          <Typography variant="body2">Hi there!</Typography>
        </div>
      )
      break
    }
    case DAY_2020_10_31: {
      title = (
        <Typography variant="h6">
          We can modify the title if we want.
        </Typography>
      )
      mainContent = (
        <div>
          <Typography variant="body2">
            We can remove the money raised if we want.
          </Typography>
          <Typography variant="body2">Another description here.</Typography>
        </div>
      )
      addendumContent = (
        <div>
          <Typography variant="body2">Hi there! :)</Typography>
        </div>
      )
      break
    }
    case DAY_2020_11_01: {
      break
    }
    case DAY_2020_11_02: {
      mainContent = (
        <div>
          {moneyRaisedDisplay}
          <Typography variant="body2">
            We're about to hit a million dollars raised! For us, it was as easy
            as opening tabs. For multi-millionaires, it's as easy as writing a
            check. Join us on{' '}
            <Link
              to={twitterPageURL}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              Twitter
            </Link>{' '}
            and{' '}
            <Link
              to={instagramPageURL}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              Instagram
            </Link>{' '}
            where we will be asking the uber-wealthy to match a $1M donation.
            We’re looking at you, @google...
          </Typography>
        </div>
      )
      addendumContent = (
        <div>
          <div className={classes.hashtag}>
            <Typography variant="subtitle2" className={classes.hashtagText}>
              #MillionaireMonday
            </Typography>
          </div>
          <Typography variant="body2" gutterBottom>
            <span style={{ fontWeight: 'bold' }}>What you can do today:</span>{' '}
            hit up some multi-millionaires on Twitter and Instagram to ask them
            to match our $1M raised.
          </Typography>
          <div>
            <div>
              <Typography variant="body2" gutterBottom>
                @Bill&MelindaGates -- TODO link to Twitter & Instagram
              </Typography>
            </div>
          </div>
        </div>
      )
      break
    }
    case DAY_2020_11_03: {
      break
    }

    case DAY_2020_11_04: {
      break
    }
    case DAY_2020_11_05: {
      break
    }
    case DAY_2020_11_06: {
      break
    }
    case DAY_2020_11_07: {
      break
    }
    case DAY_2020_11_08: {
      break
    }
    case DAY_2020_11_09: {
      break
    }
    case DAY_2020_11_10: {
      break
    }
    case DAY_2020_11_11: {
      break
    }
    case DAY_2020_11_12: {
      break
    }
    case DAY_2020_11_13: {
      break
    }
    case DAY_2020_11_14: {
      break
    }
    case DAY_2020_11_15: {
      break
    }
    case DAY_2020_11_16: {
      break
    }
    case DAY_2020_11_17: {
      break
    }
    case DAY_2020_11_18: {
      break
    }

    // TODO: handle dates past 11/18/2020
    default: {
      title = defaultTitle
      mainContent = defaultMainContent
      addendumContent = defaultAddendumContent
    }
  }

  return {
    title,
    mainContent,
    addendumContent,
  }
}

const MillionRaisedCampaign = ({
  app,
  classes,
  currentDateString,
  onDismiss,
}) => {
  const { moneyRaisedUSDString } = useMoneyRaised({
    moneyRaised: app.moneyRaised,
    dollarsPerDayRate: app.dollarsPerDayRate,
  })
  const { title, mainContent, addendumContent } = getCampaignContent({
    app,
    classes,
    currentDateString,
    moneyRaisedUSDString,
  })
  return (
    <div className={classes.root}>
      <Paper elevation={1} className={classes.paper}>
        <Paper elevation={1} className={classes.paper}>
          <div className={classes.borderTop} />
          <IconButton
            onClick={() => {
              setCampaignDismissTime()
              onDismiss()
            }}
            className={classes.closeButton}
          >
            <CloseIcon />
          </IconButton>
          <div className={classes.campaignContent}>
            <div className={classes.mainTextContainer}>
              <div className={classes.title}>{title}</div>
              <div>{mainContent}</div>
            </div>
          </div>
        </Paper>
        <div className={classes.campaignAddendum}>{addendumContent}</div>
      </Paper>
    </div>
  )
}

MillionRaisedCampaign.propTypes = {
  app: PropTypes.shape({}).isRequired,
  currentDateString: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}
MillionRaisedCampaign.defaultProps = {
  onDismiss: () => {},
}

export default withStyles(styles, { withTheme: true })(MillionRaisedCampaign)
