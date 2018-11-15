import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'

import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'
import DonateVcMutation from 'js/mutations/DonateVcMutation'

class Charity extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      amountToDonate: 1,
      customAmountSliderOpen: false,
      donateInProgress: false,
      thanksDialog: false
    }
  }

  componentDidMount () {
    const { user } = this.props
    this.setState({
      amountToDonate: user.vcCurrent
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.user.vcCurrent !== nextProps.user.vcCurrent) {
      this.setState({
        amountToDonate: nextProps.user.vcCurrent
      })
    }
  }

  openCharityWebsite () {
    const { charity } = this.props

    // The page might be iframed, so opening in _top or _blank is critical.
    window.open(charity.website, '_blank')
  }

  openCustomSlider (event) {
    this.setState({
      customAmountSliderOpen: true,
      anchorEl: event.currentTarget
    })
  }

  closeCustomSlider () {
    this.setState({
      customAmountSliderOpen: false
    })
  }

  onCustomSliderValChange (event, value) {
    this.setState({amountToDonate: value})
  }

  thanksDialogShow () {
    this.setState({
      thanksDialog: true,
      donateInProgress: false
    })
  }

  thanksDialogClose () {
    this.setState({
      thanksDialog: false
    })
  }

  heartsDonationError () {
    this.props.showError('Oops, we could not donate your Hearts just now :(')
    this.setState({
      donateInProgress: false
    })
  }

  donateHearts () {
    if (this.state.amountToDonate <= 0 || this.state.donateInProgress) {
      return
    }
    this.setState({
      donateInProgress: true
    })
    const { charity, user } = this.props
    const self = this
    DonateVcMutation.commit(
      this.props.relay.environment,
      user,
      charity.id,
      this.state.amountToDonate,
      self.thanksDialogShow.bind(this),
      self.heartsDonationError.bind(this)
    )
  }

  render () {
    const { charity, user, style, showError } = this.props

    const containerStyle = Object.assign({}, {
      minWidth: 250,
      maxWidth: 360
    }, style)

    return (
      <Paper style={containerStyle}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <span
            style={{
              padding: 0
            }}
          >
            <img
              alt={`Logo for the charity ${charity.name}`}
              style={{
                cursor: 'pointer',
                maxWidth: '100%',
                minWidth: '100%'
              }}
              src={charity.logo}
              onClick={this.openCharityWebsite.bind(this)} />
          </span>
          <span
            style={{
              padding: 16,
              fontSize: 22,
              boxSizing: 'border-box',
              display: 'block',
              textAlign: 'center',
              lineHeight: '100%'
            }}
          >
            {charity.name}
          </span>
          <span
            style={{
              boxSizing: 'border-box',
              paddingLeft: 16,
              paddingRight: 16,
              fontSize: 14,
              textAlign: 'center',
              display: 'block'
            }}
          >
            {charity.description}
          </span>
          <DonateHeartsControls
            charity={charity}
            user={user}
            showError={showError}
          />
        </span>
      </Paper>
    )
  }
}

Charity.propTypes = {
  charity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired
  }),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    vcCurrent: PropTypes.number.isRequired
  }),
  showError: PropTypes.func.isRequired,
  style: PropTypes.object
}

Charity.defaultProps = {
  style: {}
}

export default Charity
