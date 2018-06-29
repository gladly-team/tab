import React from 'react'
import PropTypes from 'prop-types'
import Joyride from 'react-joyride'

import Dialog from 'material-ui/Dialog'
import Button from '@material-ui/core/Button'

import {
  primaryColor,
  textColor
} from 'theme/default'

// Note that the target components must be mounted
// before the tour begins.
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
            <Button onClick={this.introModalButtonClick.bind(this)} color='primary' type='raised'>Great!
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
              textColor: textColor
            }
          }}
          floaterProps={{
            disableAnimation: true
          }}
        />
        <Dialog
          title='Thanks for Tabbing!'
          actionsContainerStyle={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
          actions={[
            <Button onClick={this.introFinalModalButtonClick.bind(this)} color='primary' type='raised'>Get Tabbing
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
