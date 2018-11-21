import React from 'react'
import PropTypes from 'prop-types'
import DonateVcMutation from 'js/mutations/DonateVcMutation'

import sanitizeHtml from 'sanitize-html'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Popover from '@material-ui/core/Popover'
import Slider from '@material-ui/lab/Slider'

const styles = theme => ({
  charityImpactText: {
    '& a': {
      color: '#9d4ba3',
      textDecoration: 'none'
    }
  }
})

class DonateHeartsControls extends React.Component {
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

  thanksDialogClose () {
    this.setState({
      thanksDialog: false
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
    return DonateVcMutation(
      {
        userId: user.id,
        charityId: charity.id,
        vc: this.state.amountToDonate
      })
      .then(() => {
        self.setState({
          thanksDialog: true,
          donateInProgress: false
        })
      })
      .catch(() => {
        self.props.showError('Oops, we could not donate your Hearts just now :(')
        self.setState({
          donateInProgress: false
        })
      })
  }

  render () {
    const { charity, user, theme, style, classes } = this.props

    const MIN_VC_FOR_CUSTOM_SLIDER = 2
    const heartsText = this.state.amountToDonate === 1 ? 'Heart' : 'Hearts'

    const impactMessage = sanitizeHtml(charity.impact, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p'],
      allowedAttributes: {
        a: ['href', 'target', 'rel']
      }
    })

    return (
      <span>
        <span
          style={Object.assign({}, style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          })}
        >
          <Button
            color={'primary'}
            variant={'contained'}
            disabled={this.state.amountToDonate <= 0 || this.state.donateInProgress}
            onClick={this.donateHearts.bind(this)}
          >
            Donate {this.state.amountToDonate} {heartsText}
          </Button>
          { user.vcCurrent > MIN_VC_FOR_CUSTOM_SLIDER
            ? <span
              style={{
                fontSize: 11,
                color: theme.palette.text.disabled,
                cursor: 'pointer',
                marginTop: 5
              }}
              onClick={this.openCustomSlider.bind(this)}>
              <Typography
                variant={'caption'}
                style={{
                  color: theme.palette.text.disabled
                }}
              >
                  Or, donate a specific amount
              </Typography>
            </span>
            : null
          }
        </span>
        <Popover
          open={this.state.customAmountSliderOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          transformOrigin={{horizontal: 'left', vertical: 'top'}}
          onClose={this.closeCustomSlider.bind(this)}
        >
          <div
            style={{
              width: 330,
              height: 'auto',
              padding: 20
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 15
              }}
            >
              <Typography
                variant={'body2'}
              >
                Fewer Hearts
              </Typography>
              <Typography
                variant={'body2'}
              >
                More Hearts
              </Typography>
            </div>
            <Slider
              min={1}
              max={user.vcCurrent}
              step={1}
              value={this.state.amountToDonate}
              onChange={this.onCustomSliderValChange.bind(this)}
            />
          </div>
        </Popover>
        <Dialog
          open={this.state.thanksDialog}
          onClose={this.thanksDialogClose.bind(this)}
        >
          <DialogTitle disableTypography>
            <Typography
              variant={'h5'}
              style={{
                lineHeight: 1.3,
                textAlign: 'center'
              }}
            >
              Thanks for supporting{' '}
              <span
                style={{
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onClick={this.openCharityWebsite.bind(this)}
              >
                {charity.name}
              </span>!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                maxWidth: '100%'
              }}
            >
              <img
                alt={`A demonstration of the work by ${charity.name}.`}
                style={{
                  height: 240,
                  border: `4px solid ${theme.palette.primary.main}`
                }}
                src={charity.image}
              />
            </span>
            <div
              style={{
                paddingTop: charity.imageCaption ? 0 : 14,
                paddingLeft: 34,
                paddingRight: 34,
                paddingBottom: 0
              }}
            >
              { charity.imageCaption
                ? <Typography
                  variant={'caption'}
                  style={{
                    color: theme.palette.text.disabled,
                    marginBottom: 4
                  }}
                >
                  {charity.imageCaption}
                </Typography>
                : null
              }
              <span
                style={theme.typography.body2}
                className={classes.charityImpactText}
                dangerouslySetInnerHTML={{__html: impactMessage}}
              />
            </div>
          </DialogContent>
          <DialogActions
            style={{
              margin: 10
            }}
          >
            <Button
              color={'primary'}
              variant={'contained'}
              onClick={this.thanksDialogClose.bind(this)}
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    )
  }
}

DonateHeartsControls.propTypes = {
  charity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    impact: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired
  }),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    vcCurrent: PropTypes.number.isRequired
  }),
  showError: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

DonateHeartsControls.defaultProps = {
  style: {}
}

export default withStyles(styles, { withTheme: true })(DonateHeartsControls)
