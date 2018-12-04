import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import FacebookBox from 'mdi-material-ui/FacebookBox'
import Twitter from 'mdi-material-ui/Twitter'

import logoGrey from 'js/assets/logos/logo-grey.svg'
import {
  adblockerWhitelistingURL,
  contactUsURL,
  externalHelpURL,
  facebookPageURL,
  financialsURL,
  jobsURL,
  privacyPolicyURL,
  teamURL,
  termsOfServiceURL,
  twitterPageURL
} from 'js/navigation/navigation'
import Link from 'js/components/General/Link'

// Matches tab-homepage style.
const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const lightestShadingColor = 'rgba(128, 128, 128, 0.04)'
const lighterTextColor = '#838383'
const lightestTextColor = '#cecece'

const styles = theme => ({
  footerLink: {
    textDecoration: 'none',
    color: lightestTextColor,
    fontSize: 12,
    margin: 20,
    '&:hover': {
      color: lighterTextColor
    }
  }
})

const IconWrapper = props => <div>{props.children}</div>

class Footer extends React.Component {
  render () {
    const { classes, style } = this.props
    const socialIconStyle = {
      color: lightestTextColor,
      width: 20,
      height: 20
    }
    const socialIconHoverStyle = {
      color: lighterTextColor
    }
    return (
      <div
        style={Object.assign(
          {},
          {
            background: lightestShadingColor,
            paddingTop: 1,
            paddingBottom: 20,
            paddingLeft: 40,
            paddingRight: 40,
            fontFamily: fontFamily
          },
          style
        )}
      >
        <Divider style={{ width: '100%', marginBottom: 20 }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexWrap: 'nowrap',
              alignItems: 'center'
            }}
          >
            <Link to='/'>
              <img src={logoGrey} style={{ height: 43 }} alt='Tab for a Cause logo in grey' />
            </Link>
            <div
              style={{
                marginLeft: 30,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start'
              }}
            >
              <Link
                to={externalHelpURL}
                className={classes.footerLink}
              >
                Help
              </Link>
              <Link
                to={adblockerWhitelistingURL}
                className={classes.footerLink}
              >
                Adblockers
              </Link>
              <Link
                to={financialsURL}
                className={classes.footerLink}
              >
                Financials
              </Link>
              <Link
                to={termsOfServiceURL}
                className={classes.footerLink}
              >
                Terms
              </Link>
              <Link
                to={privacyPolicyURL}
                className={classes.footerLink}
              >
                Privacy
              </Link>
              <Link
                to={teamURL}
                className={classes.footerLink}
              >
                Team
              </Link>
              <Link
                to={contactUsURL}
                className={classes.footerLink}
              >
                Contact
              </Link>
              <Link
                to={jobsURL}
                className={classes.footerLink}
              >
                Jobs
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 4 }}>
            <Link to={facebookPageURL} style={{ margin: 12 }}>
              <IconWrapper
                style={socialIconStyle}
                hoverStyle={socialIconHoverStyle}
              >
                <FacebookBox />
              </IconWrapper>
            </Link>

            <Link to={twitterPageURL} style={{ margin: 12 }}>
              <IconWrapper
                style={socialIconStyle}
                hoverStyle={socialIconHoverStyle}
              >
                <Twitter />
              </IconWrapper>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

Footer.propTypes = {
  style: PropTypes.object,
  classes: PropTypes.object.isRequired
}

Footer.defaultProps = {
  style: {}
}

export default withStyles(styles)(Footer)
