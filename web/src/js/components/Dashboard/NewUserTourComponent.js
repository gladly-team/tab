import React from 'react'
import PropTypes from 'prop-types'
import Joyride from 'react-joyride'

import Dialog from 'material-ui/Dialog'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import {
  primaryColor,
  textColor
} from 'theme/default'

// Note that the target components must be mounted
// before the tour begins.
// https://github.com/gilbarbara/react-joyride/blob/master/docs/step.md
const tourSteps = [
  {
    target: '[data-tour-id="hearts"]',
    content: "You'll earn a Heart with every tab you open. You can then donate your Hearts to your favorite charity to tell us where the money should go.",
    placement: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true
  },
  {
    target: '[data-tour-id="settings-button"]',
    content: 'Change your background image, customize your tab, or donate Hearts in the settings menu.',
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '[data-tour-id="widgets"]',
    content: 'Add bookmarks, take notes, and more with widgets.',
    placement: 'bottom',
    disableBeacon: true
  }
]

const CustomTooltip = (props) => {
  return (
    <div style={{ width: 340 }}>
      <Paper>
        <div style={{ padding: 20 }}>{props.content}</div>
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
    // const { show } = this.props
    return (
      <span>
        <Dialog
          title='Your tabs are now doing good!'
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
              Great!
            </Button>
          ]}
          modal
          open={this.state.introModalOpen}
          contentStyle={{
            maxWidth: 500
          }}
        >
          <p>You're now raising money for charity with every tab you open. Hooray! (The money comes from showing ads in the corner of the page.)</p>
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
          title='Thanks for Tabbing!'
          actionsContainerStyle={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
          actions={[
            <Button
              onClick={this.introFinalModalButtonClick.bind(this)}
              color='primary'
            >
              Get Tabbing
            </Button>
          ]}
          modal
          open={this.state.introFinalModalOpen}
          contentStyle={{
            maxWidth: 500
          }}
        >
          <p>Thanks for changing the world, one tab at a time. We're thrilled to have you!</p>
        </Dialog>
      </span>
    )
  }
}

NewUserTour.propTypes = {
  show: PropTypes.bool
}

NewUserTour.defaultProps = {
  show: false
}

export default NewUserTour
