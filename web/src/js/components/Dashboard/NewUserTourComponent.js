import React from 'react'
import PropTypes from 'prop-types'
import Joyride from 'react-joyride'

import Dialog from 'material-ui/Dialog'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import EarthIcon from 'mdi-material-ui/Earth'
import HeartIcon from 'material-ui/svg-icons/action/favorite'
import InviteFriend from '../Settings/Profile/InviteFriendContainer'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_NEW_USER_HAS_COMPLETED_TOUR } from '../../constants'

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
    disableBeacon: true,
    disableOverlayClose: true
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

const CustomTooltip = (props) => {
  return (
    <div style={{ width: 300 }}>
      <Paper>
        <div style={{ padding: 20 }}>
          <Typography variant='body1'>{props.content}</Typography>
        </div>
        <span style={{ display: 'flex', justifyContent: 'flex-end', padding: 10 }}>
          { (props.stepIndex > 0) ? (
            <Button
              onClick={props.goToPreviousStep}
              color='default'
            >
              Back
            </Button>
          ) : null
          }
          <Button
            onClick={props.goToNextStep}
            color='primary'
          >
            Next
          </Button>
        </span>
      </Paper>
    </div>
  )
}

CustomTooltip.propTypes = {
  content: PropTypes.string,
  stepIndex: PropTypes.number.isRequired,
  goToNextStep: PropTypes.func.isRequired,
  goToPreviousStep: PropTypes.func.isRequired
}

CustomTooltip.defaultProps = {}

class NewUserTour extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      introModalOpen: true,
      beginTour: false,
      stepIndex: 0,
      introFinalModalOpen: false
    }
  }

  joyrideCallback (data) {
    const { action, index } = data
    const isTourFinished = action === 'next' && index >= tourSteps.length
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

  goToPreviousStep () {
    this.setState({
      stepIndex: this.state.stepIndex - 1
    })
  }

  goToNextStep () {
    this.setState({
      stepIndex: this.state.stepIndex + 1
    })
  }

  getCurrentStepContent () {
    const stepObj = tourSteps[this.state.stepIndex]
    if (stepObj && stepObj.content) {
      return stepObj.content
    } else {
      return null
    }
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
          title='Your tabs are changing the world!'
          actionsContainerStyle={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
          actions={[
            <Button
              onClick={this.introModalButtonClick.bind(this)}
              color='primary'
            >
              Next
            </Button>
          ]}
          modal
          open={this.state.introModalOpen}
          contentStyle={{
            maxWidth: 500
          }}
        >
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <EarthIcon style={{ color: primaryColor, width: 32, height: 32, margin: 10, marginTop: 0 }} />
            <HeartIcon color={primaryColor} style={{ width: 32, height: 32, margin: 10, marginTop: 0 }} />
          </span>
          <Typography variant='body1' paragraph>Now, every tab you open raises money for charity. (The money comes from showing ads in the corner of the page.)</Typography>
          <Typography variant='body1' paragraph>Just by surfing the web, you're feeding children, protecting the rainforest, and more.</Typography>
        </Dialog>
        <Joyride
          steps={tourSteps}
          stepIndex={this.state.stepIndex}
          run={this.state.beginTour}
          continuous
          disableOverlayClose
          callback={this.joyrideCallback.bind(this)}
          styles={{
            zIndex: 4600,
            options: {
              arrowColor: '#fff',
              backgroundColor: '#fff',
              primaryColor: primaryColor,
              textColor: textColor,
              overlayColor: 'rgba(0, 0, 0, 0.56)'
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
          tooltipComponent={
            <CustomTooltip
              content={this.getCurrentStepContent()}
              stepIndex={this.state.stepIndex}
              goToNextStep={this.goToNextStep.bind(this)}
              goToPreviousStep={this.goToPreviousStep.bind(this)}
            />
          }
        />
        <Dialog
          title="We're thrilled to have you!"
          actionsContainerStyle={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
          actions={[
            <Button
              onClick={this.introFinalModalButtonClick.bind(this)}
              color='default'
            >
              Skip for now
            </Button>
          ]}
          modal
          open={this.state.introFinalModalOpen}
          contentStyle={{
            maxWidth: 500
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant='body1' paragraph>Thanks for making the world a better place, one tab at a time.</Typography>
            <Typography variant='body1' paragraph>We can make a bigger impact together. Share Tab for a Cause with a few friends!</Typography>
            <InviteFriend style={{ alignSelf: 'center' }} user={user} />
          </div>
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
