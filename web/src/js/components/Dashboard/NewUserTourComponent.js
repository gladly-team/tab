import React from 'react'
import PropTypes from 'prop-types'
import Joyride from 'react-joyride'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EarthIcon from 'mdi-material-ui/Earth'
import HeartIcon from 'material-ui/svg-icons/action/favorite'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_NEW_USER_HAS_COMPLETED_TOUR } from 'js/constants'

import {
  primaryColor,
  textColor
} from 'js/theme/default'

// Note that the target components must be mounted
// before the tour begins.
// https://github.com/gilbarbara/react-joyride/blob/master/docs/step.md
const tourSteps = [
  {
    target: '[data-tour-id="hearts"]',
    content: "You'll earn a Heart with every tab you open. Donate your Hearts to your favorite charity to tell us where to give money.",
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '[data-tour-id="settings-button"]',
    content: 'Visit your settings to change your background image, donate Hearts, and track your progress.',
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '[data-tour-id="widgets"]',
    content: 'Use widgets to add bookmarks, take notes, and more.',
    placement: 'bottom',
    disableBeacon: true
  }
]

// https://docs.react-joyride.com/custom-components
const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}) => {
  return (
    <div {...tooltipProps} style={{ width: 300 }}>
      <Paper>
        <div style={{ padding: 20 }}>
          <Typography variant={'body2'}>{step.content}</Typography>
        </div>
        <span style={{ display: 'flex', justifyContent: 'flex-end', padding: 10 }}>
          { (index > 0) ? (
            <Button
              {...backProps}
              color='default'
            >
              Back
            </Button>
          ) : null
          }
          <Button
            {...primaryProps}
            color='primary'
          >
            Next
          </Button>
        </span>
      </Paper>
    </div>
  )
}

class NewUserTour extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      introModalOpen: true,
      beginTour: false,
      introFinalModalOpen: false
    }
  }

  joyrideCallback (data) {
    const { status } = data
    const isTourFinished = status === 'finished'
    if (isTourFinished) {
      this.setState({
        introFinalModalOpen: true
      })

      // Mark that the user has viewed the tour
      localStorageMgr.setItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR, 'true')
    }
  }

  introModalButtonClick () {
    this.setState({
      introModalOpen: false,
      beginTour: true
    })
  }

  introFinalModalButtonClick () {
    this.setState({
      introFinalModalOpen: false
    })
  }

  render () {
    const { user } = this.props
    return (
      <span>
        <Dialog
          open={this.state.introModalOpen}
          disableBackdropClick
          disableEscapeKeyDown
          PaperProps={{
            style: {
              maxWidth: 500
            }
          }}
        >
          <DialogTitle disableTypography>
            <Typography variant={'h6'}>
              Your tabs are changing the world!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <EarthIcon style={{ color: primaryColor, width: 32, height: 32, margin: 10, marginTop: 0 }} />
              <HeartIcon color={primaryColor} style={{ width: 32, height: 32, margin: 10, marginTop: 0 }} />
            </span>
            <Typography variant={'body2'} paragraph>Now, every tab you open raises money for charity. (The money comes from showing ads in the corner of the page.)</Typography>
            <Typography variant={'body2'} paragraph>Just by surfing the web, you're feeding children, protecting the rainforest, and more.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.introModalButtonClick.bind(this)} color='primary'>
              Next
            </Button>
          </DialogActions>
        </Dialog>
        <Joyride
          steps={tourSteps}
          stepIndex={this.state.stepIndex}
          run={this.state.beginTour}
          continuous
          disableOverlayClose
          callback={this.joyrideCallback.bind(this)}
          styles={{
            options: {
              arrowColor: '#fff',
              backgroundColor: '#fff',
              primaryColor: primaryColor,
              textColor: textColor,
              overlayColor: 'rgba(0, 0, 0, 0.56)',
              zIndex: 4600
            },
            overlay: {
              cursor: 'default'
            }
          }}
          floaterProps={{
            disableAnimation: true
          }}
          // We're choosing to control the component so it will match
          // the app theme. But we can remove this and the "stepIndex"
          // prop to let Joyride handle it.
          tooltipComponent={CustomTooltip}
        />
        <Dialog
          open={this.state.introFinalModalOpen}
          disableBackdropClick
          disableEscapeKeyDown
          PaperProps={{
            style: {
              maxWidth: 500
            }
          }}
        >
          <DialogTitle disableTypography>
            <Typography variant={'h6'}>
              We're thrilled to have you!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant={'body2'} paragraph>Thanks for making the world a better place, one tab at a time.</Typography>
              <Typography variant={'body2'} paragraph>We can make a bigger impact together. Share Tab for a Cause with a few friends!</Typography>
              <InviteFriend style={{ alignSelf: 'center' }} user={user} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.introFinalModalButtonClick.bind(this)}
              color='default'
            >
              Skip for now
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    )
  }
}

NewUserTour.propTypes = {
  user: PropTypes.shape({
  }).isRequired
}

NewUserTour.defaultProps = {
}

export default NewUserTour
