import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import grey from '@material-ui/core/colors/grey'
import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'
import orange from '@material-ui/core/colors/orange'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'
import {
  millionRaisedURL,
  millionRaisedRainforestImpactURL,
  // millionRaisedWaterImpactURL,
  // millionRaisedHungerImpactURL,
  // millionRaisedGiveImpactURL,
  // millionRaisedReadImpactURL,
  // millionRaisedChildrenImpactURL,
  // millionRaisedEducateImpactURL,
  facebookPageURL,
  instagramPageURL,
  twitterPageURL,
} from 'js/navigation/navigation'
import useMoneyRaised from 'js/utils/hooks/useMoneyRaised'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import TreeIcon from 'mdi-material-ui/PineTree'
import SocialShare from 'js/components/General/SocialShareComponent'

const primaryMainColor = '#9d4ba3'
const secondaryMainColor = '#4a90e2'

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
    display: 'flex',
    flexDirection: 'column',
    background: grey[100],
    padding: 12,
  },
  mainTextContainer: {},
  title: {
    textAlign: 'center',
  },
  moneyRaised: {
    color: theme.palette.primary.main,
  },
  description: {
    margin: 14,
    textAlign: 'left',
  },
  link: {
    color: theme.palette.primary.main,
  },
  hashtag: {
    margin: '0px auto 10px auto',
    background: grey[500],
    padding: '2px 14px',
    borderRadius: 3,
    display: 'inline-block',
  },
  hashtagText: {
    color: 'white',
  },
  addendumButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  impactStatContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  impactStatIcon: {
    flex: 1,
  },
  impactStatText: {
    flex: 6,
  },
})

const DAY_2020_11_02 = '2020-11-02' // Monday
const DAY_2020_11_03 = '2020-11-03'
const DAY_2020_11_04 = '2020-11-04' // Wednesday
const DAY_2020_11_05 = '2020-11-05'
const DAY_2020_11_06 = '2020-11-06' // Friday
const DAY_2020_11_07 = '2020-11-07'
const DAY_2020_11_08 = '2020-11-08'
const DAY_2020_11_09 = '2020-11-09' // Monday
const DAY_2020_11_10 = '2020-11-10'
const DAY_2020_11_11 = '2020-11-11' // Wednesday
const DAY_2020_11_12 = '2020-11-12'
const DAY_2020_11_13 = '2020-11-13' // Friday
const DAY_2020_11_14 = '2020-11-14'
const DAY_2020_11_15 = '2020-11-15'
const DAY_2020_11_16 = '2020-11-16' // Monday
const DAY_2020_11_17 = '2020-11-17'
const DAY_2020_11_18 = '2020-11-18'

const getCampaignContent = ({
  app,
  user,
  classes,
  currentDateString,
  moneyRaisedUSDString,
}) => {
  const defaultTitle = (
    <Typography variant="h6">A tab you'll want to keep open:</Typography>
  )
  const getDefaultMainContent = ({ themeColor }) => (
    <div>
      <Typography variant="h2" align={'center'} gutterBottom>
        <span className={classes.moneyRaised} style={{ color: themeColor }}>
          {moneyRaisedUSDString}
        </span>
      </Typography>
      <Typography variant="body2" align="center">
        We're about to reach $1M raised for charity!
      </Typography>
      <Typography variant="body2" align="center" gutterBottom>
        Thank you – it's incredible{' '}
        <Link
          to={millionRaisedURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColor }}
        >
          what we've accomplished together
        </Link>
        .
      </Typography>
    </div>
  )
  const getDefaultAddendumContent = ({ themeColor }) => (
    <>
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
          style={{ color: themeColor }}
        >
          the real-world good your tabs have turned into here
        </Link>
        ! Share the achievement you're proudest of.
      </Typography>
    </>
  )

  const defaultThemeColor = orange[600]
  const themeColorMonday = amber[700]
  const themeColorTuesday = primaryMainColor
  const themeColorWednesday = orange[700]
  const themeColorThursday = secondaryMainColor
  const themeColorFriday = green[600]
  const themeColorWeekend = primaryMainColor

  const addendumContentMonday = (
    <>
      <div className={classes.hashtag}>
        <Typography variant="subtitle2" className={classes.hashtagText}>
          #MillionaireMonday
        </Typography>
      </div>
      <Typography variant="body2" gutterBottom>
        <span style={{ fontWeight: 'bold' }}>What you can do today: </span>@ a
        multi-millionaire to have them match our $1M! For us, it was as easy as
        opening tabs. For them, it's as easy as writing a check.
      </Typography>
    </>
  )
  const addendumContentTuesday = (
    <>
      <div className={classes.hashtag}>
        <Typography variant="subtitle2" className={classes.hashtagText}>
          #TabberTuesday
        </Typography>
      </div>
      <Typography variant="body2" gutterBottom>
        <span style={{ fontWeight: 'bold' }}>What you can do today: </span>
        Tell us why you tab! This milestone wouldn't have been possible without
        all of you, and we'd love to feature you. DM us @tabforacause (
        <Link
          to={instagramPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorTuesday }}
        >
          Instagram
        </Link>
        ,{' '}
        <Link
          to={facebookPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorTuesday }}
        >
          Facebook
        </Link>
        ,{' '}
        <Link
          to={twitterPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorTuesday }}
        >
          Twitter
        </Link>
        ) or post using #TabForAMillion.
      </Typography>
    </>
  )
  const addendumContentWednesday = (
    <>
      <div className={classes.hashtag}>
        <Typography variant="subtitle2" className={classes.hashtagText}>
          #WelcomeWednesday
        </Typography>
      </div>
      <Typography variant="body2">
        <span style={{ fontWeight: 'bold' }}>What you can do today: </span>Text,
        email, tiktok, carrier-pigeon, or talk to 2 friends about Tab for a
        Cause!
      </Typography>
      <InviteFriend
        user={user}
        style={{ margin: 16 }}
        label={'Share this link with a few friends:'}
        helperText={
          "If everyone does, we'll be celebrating $2M raised within months!"
        }
        InputProps={{ style: { fontSize: '0.875rem' } }}
      />
    </>
  )
  const addendumContentThursday = (
    <>
      <div className={classes.hashtag}>
        <Typography variant="subtitle2" className={classes.hashtagText}>
          #ThankfulThursday
        </Typography>
      </div>
      <Typography variant="body2" gutterBottom>
        <span style={{ fontWeight: 'bold' }}>What you can do today: </span>
        Let the world know how impactful a tab can be by liking or sharing our
        #ThankfulThursday posts, showcasing our amazing charity partners, on{' '}
        <Link
          to={instagramPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorThursday }}
        >
          Instagram
        </Link>
        ,{' '}
        <Link
          to={facebookPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorThursday }}
        >
          Facebook
        </Link>
        , and{' '}
        <Link
          to={twitterPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorThursday }}
        >
          Twitter
        </Link>
        .
      </Typography>
    </>
  )
  const addendumContentFriday = (
    <>
      <div className={classes.hashtag}>
        <Typography variant="subtitle2" className={classes.hashtagText}>
          #FriendFriday
        </Typography>
      </div>
      <Typography variant="body2" gutterBottom>
        We are proud to support nine incredible nonprofit partners who turn our
        tabs into concrete impact. Check out what they have to say about Tab for
        a Cause on{' '}
        <Link
          to={instagramPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorFriday }}
        >
          Instagram
        </Link>
        ,{' '}
        <Link
          to={facebookPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorFriday }}
        >
          Facebook
        </Link>
        , and{' '}
        <Link
          to={twitterPageURL}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ color: themeColorFriday }}
        >
          Twitter
        </Link>
        .
      </Typography>
    </>
  )
  const addendumContentWeekend = (
    <>
      <div className={classes.impactStatContainer}>
        <TreeIcon className={classes.impactStatIcon} />
        <Typography variant="body2" className={classes.impactStatText}>
          Tabbers have raised enough to
          <span style={{ fontWeight: 'bold' }}>
            {' '}
            protect over 5,000 acres of rainforest!
          </span>
        </Typography>
      </div>
      <SocialShare
        /* FIXME: actual copy needed */
        url={millionRaisedRainforestImpactURL}
        iconSize={24}
        FacebookShareButtonProps={{
          quote:
            'We just helped protect 100 families in rainforest communities via Cool Earth. And all we did was open browser tabs.',
        }}
        RedditShareButtonProps={{
          title:
            'Tabs transformed into vital supplies for 100 families in rainforest communities',
        }}
        TumblrShareButtonProps={{
          title:
            'Tabs transformed into vital supplies for 100 families in rainforest communities',
          caption:
            'We just helped protect 100 families in rainforest communities via Cool Earth. And all we did was open browser tabs.',
        }}
        TwitterShareButtonProps={{
          title:
            'On @TabForACause, we just supplied 100 rainforest families via @coolearth just by opening tabs. #COVID19',
          related: ['@TabForACause'],
        }}
      />
    </>
  )

  let title = defaultTitle
  let themeColor = defaultThemeColor
  let mainContent = getDefaultMainContent({ themeColor })
  let addendumContent = getDefaultAddendumContent({ themeColor })
  switch (currentDateString) {
    case DAY_2020_11_02: {
      addendumContent = addendumContentMonday
      themeColor = themeColorMonday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_03: {
      addendumContent = addendumContentTuesday
      themeColor = themeColorTuesday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_04: {
      addendumContent = addendumContentWednesday
      themeColor = themeColorWednesday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_05: {
      addendumContent = addendumContentThursday
      themeColor = themeColorThursday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_06: {
      addendumContent = addendumContentFriday
      themeColor = themeColorFriday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_07: {
      addendumContent = addendumContentWeekend
      themeColor = themeColorWeekend
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_08: {
      addendumContent = addendumContentWeekend
      themeColor = themeColorWeekend
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_09: {
      addendumContent = addendumContentMonday
      themeColor = themeColorMonday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_10: {
      addendumContent = addendumContentTuesday
      themeColor = themeColorTuesday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_11: {
      addendumContent = addendumContentWednesday
      themeColor = themeColorWednesday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_12: {
      addendumContent = addendumContentThursday
      themeColor = themeColorThursday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_13: {
      addendumContent = addendumContentFriday
      themeColor = themeColorFriday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_14: {
      addendumContent = addendumContentWeekend
      themeColor = themeColorWeekend
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_15: {
      addendumContent = addendumContentWeekend
      themeColor = themeColorWeekend
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_16: {
      addendumContent = addendumContentMonday
      themeColor = themeColorMonday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_17: {
      addendumContent = addendumContentTuesday
      themeColor = themeColorTuesday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    case DAY_2020_11_18: {
      addendumContent = addendumContentWednesday
      themeColor = themeColorWednesday
      mainContent = getDefaultMainContent({ themeColor })
      break
    }
    // TODO: handle dates past 11/18/2020
    default: {
      title = defaultTitle
      themeColor = defaultThemeColor
      mainContent = getDefaultMainContent({ themeColor })
      addendumContent = getDefaultAddendumContent({ themeColor })
    }
  }

  return {
    title,
    mainContent,
    addendumContent,
    themeColor,
  }
}

const MillionRaisedCampaign = ({
  app,
  user,
  classes,
  currentDateString,
  onDismiss,
}) => {
  const { moneyRaisedUSDString } = useMoneyRaised({
    moneyRaised: app.moneyRaised,
    dollarsPerDayRate: app.dollarsPerDayRate,
  })
  const {
    title,
    mainContent,
    addendumContent,
    themeColor,
  } = getCampaignContent({
    app,
    user,
    classes,
    currentDateString,
    moneyRaisedUSDString,
  })
  return (
    <div className={classes.root}>
      <Paper elevation={1} className={classes.paper}>
        <Paper elevation={1} className={classes.paper}>
          <div
            className={classes.borderTop}
            style={{ backgroundColor: themeColor }}
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
  user: PropTypes.shape({}).isRequired,
  currentDateString: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}
MillionRaisedCampaign.defaultProps = {
  onDismiss: () => {},
}

export default withStyles(styles, { withTheme: true })(MillionRaisedCampaign)
