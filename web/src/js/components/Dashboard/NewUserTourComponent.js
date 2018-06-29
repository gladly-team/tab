import React from 'react'
import PropTypes from 'prop-types'
import Joyride from 'react-joyride'

import Dialog from 'material-ui/Dialog'
import Button from '@material-ui/core/Button'

// Note that the target components must be mounted
// before the tour begins.
const tourSteps = [
  {
    target: '[data-tour-id="hearts"]',
    content: "You'll earn a Heart with every tab you open. You can then donate your Hearts to your favorite charity to tell us where the money should go.",
    placement: 'bottom',
    disableBeacon: true
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
      beginTour: false
    }
  }

  // joyrideCallback (data) {
  //   const { action, index, type } = data
  // }

  introModalButtonClick () {
    this.setState({
      introModalOpen: false,
      beginTour: true
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
            justifyContent: 'space-between',
            alignItems: 'flex-end'
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
          // callback={this.joyrideCallback.bind(this)}
          styles={{
            zIndex: 4600
          }}
          floaterProps={{
            disableAnimation: true
          }}
        />
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
