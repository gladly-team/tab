import React from 'react'
import PropTypes from 'prop-types'
import DonateVcMutation from 'mutations/DonateVcMutation'

import { Paper } from 'material-ui'

import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Popover from 'material-ui/Popover'
import RaisedButton from 'material-ui/RaisedButton'
import Slider from 'material-ui/Slider'
import Subheader from 'material-ui/Subheader'

import appTheme from 'theme/default'

class Charity extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      amountToDonate: 1,
      customAmountSliderOpen: false,
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
      thanksDialog: true
    })
  }

  thanksDialogClose () {
    this.setState({
      thanksDialog: false
    })
  }

  heartsDonationError () {
    this.props.showError('Oops, we could not donate your Hearts just now :(')
  }

  donateHearts () {
    if (this.state.amountToDonate <= 0) {
      return
    }
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
    const { charity, user } = this.props

    const MIN_VC_FOR_CUSTOM_SLIDER = 2

    const cardStyle = {
    }
    const titleAndTextContainerStyle = {
      display: 'block',
      minHeight: 120,
      marginTop: 8
    }
    const cardTitleContainerStyle = {
    }
    const cardTitleStyle = {
      lineHeight: '100%'
    }
    const cardTextStyle = {
      paddingTop: 0,
      paddingBottom: 0
    }
    const cardActionsStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 12,
      paddingBottom: 24
    }
    const customDonationLinkStyle = {
      display: user.vcCurrent > MIN_VC_FOR_CUSTOM_SLIDER ? 'block' : 'none',
      fontSize: 11,
      color: appTheme.palette.disabledColor,
      cursor: 'pointer',
      marginTop: 5
    }
    const sliderContainerStyle = {
      textAlign: 'center',
      height: 'auto',
      width: 'auto',
      padding: 20
    }
    const sliderStyle = {
      margin: 0
    }
    const subheaderStyle = {
      padding: 0
    }
    const charityLogoStyle = {
      cursor: 'pointer'
    }
    const charityImpactStyle = {
      marginTop: 0,
      paddingLeft: 20,
      paddingRight: 20
    }
    const linkToCharityStyle = {
      color: '#2196F3',
      cursor: 'pointer'
    }

    const heartsText = this.state.amountToDonate === 1 ? 'Heart' : 'Hearts'

    return (
      <Paper>
        <Card style={cardStyle} zDepth={1}>
          <CardMedia>
            <img
              style={charityLogoStyle}
              src={charity.logo}
              onClick={this.openCharityWebsite.bind(this)} />
          </CardMedia>
          <span style={titleAndTextContainerStyle}>
            <CardTitle
              style={cardTitleContainerStyle}
              titleStyle={cardTitleStyle}
              title={charity.name}
            />
            <CardText
              style={cardTextStyle}>
              {charity.description}
            </CardText>
          </span>
          <CardActions style={cardActionsStyle}>
            <RaisedButton
              label={`Donate ${this.state.amountToDonate} ${heartsText}`}
              primary
              disabled={this.state.amountToDonate <= 0}
              onClick={this.donateHearts.bind(this)} />
            <span
              style={customDonationLinkStyle}
              onClick={this.openCustomSlider.bind(this)}>
                 Or, donate a specific amount
            </span>
          </CardActions>
        </Card>
        <Popover
          open={this.state.customAmountSliderOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeCustomSlider.bind(this)}>
          <div style={sliderContainerStyle}>
            <Subheader
              style={subheaderStyle}>
              Use the slider to select the amount to donate
            </Subheader>
            { user.vcCurrent > MIN_VC_FOR_CUSTOM_SLIDER
              ? <Slider
                sliderStyle={sliderStyle}
                min={1}
                max={user.vcCurrent}
                step={1}
                defaultValue={1}
                value={this.state.amountToDonate}
                onChange={this.onCustomSliderValChange.bind(this)}
              />
              : null
          }
          </div>
        </Popover>
        <Dialog
          title='Thank you for donating your Hearts!'
          modal={false}
          actions={[
            <FlatButton
              label='Done'
              primary
              onClick={this.thanksDialogClose.bind(this)}
            />
          ]}
          open={this.state.thanksDialog}
          onRequestClose={this.thanksDialogClose.bind(this)}>
          <Paper>
            <span>
              <img src={charity.image} />
            </span>
            <span>
              <p style={charityImpactStyle}>Thanks for donating to <span
                style={linkToCharityStyle}
                onClick={this.openCharityWebsite.bind(this)}>{charity.name}</span></p>
              <p style={charityImpactStyle}>{charity.impact}</p>
            </span>
          </Paper>
        </Dialog>
      </Paper>
    )
  }
}

Charity.propTypes = {
  charity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    impact: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired
  }),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    vcCurrent: PropTypes.number.isRequired
  }),
  showError: PropTypes.func.isRequired
}

export default Charity
