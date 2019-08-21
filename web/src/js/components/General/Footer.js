import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import logoGrey from 'js/assets/logos/logo-grey.svg'
import {
  adblockerWhitelistingURL,
  contactUsURL,
  externalHelpURL,
  financialsURL,
  homeURL,
  jobsURL,
  privacyPolicyURL,
  teamURL,
  termsOfServiceURL,
} from 'js/navigation/navigation'
import Link from 'js/components/General/Link'

// Matches tab-homepage style.
const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const lightestShadingColor = 'rgba(128, 128, 128, 0.04)'
const lighterTextColor = '#838383'
const lightestTextColor = '#cecece'

//  Footer link component
const footerLinkStyles = theme => ({
  footerLink: {
    textDecoration: 'none',
    color: lightestTextColor,
    fontSize: 12,
    margin: 20,
    '&:hover': {
      color: lighterTextColor,
    },
  },
})

const FooterLinkComponent = props => {
  const { children, classes, ...otherProps } = props
  return (
    <Link {...otherProps} className={classes.footerLink}>
      {children}
    </Link>
  )
}

FooterLinkComponent.propTypes = {
  children: PropTypes.element,
  classes: PropTypes.object.isRequired,
}
FooterLinkComponent.defaultProps = {}
const FooterLink = withStyles(footerLinkStyles)(FooterLinkComponent)
export { FooterLink }

// Footer component
const styles = theme => ({
  divider: {
    width: '100%',
    marginBottom: 20,
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

class Footer extends React.Component {
  render() {
    const { classes, style } = this.props
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
            fontFamily: fontFamily,
          },
          style
        )}
      >
        <Divider className={classes.divider} />
        <div className={classes.contentContainer}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexWrap: 'nowrap',
              alignItems: 'center',
            }}
          >
            <Link to={homeURL}>
              <img
                src={logoGrey}
                style={{ height: 43 }}
                alt="Tab for a Cause logo in grey"
              />
            </Link>
            <div
              style={{
                marginLeft: 30,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
              }}
            >
              <FooterLink to={externalHelpURL}>Help</FooterLink>
              <FooterLink to={adblockerWhitelistingURL}>Adblockers</FooterLink>
              <FooterLink to={financialsURL}>Financials</FooterLink>
              <FooterLink to={termsOfServiceURL}>Terms</FooterLink>
              <FooterLink to={privacyPolicyURL}>Privacy</FooterLink>
              <FooterLink to={teamURL}>Team</FooterLink>
              <FooterLink to={contactUsURL}>Contact</FooterLink>
              <FooterLink to={jobsURL}>Jobs</FooterLink>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Footer.propTypes = {
  children: PropTypes.element,
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
}

Footer.defaultProps = {
  style: {},
}

export default withStyles(styles)(Footer)
