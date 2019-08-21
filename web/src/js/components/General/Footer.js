import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import logoGrey from 'js/assets/logos/logo-grey.svg'
import {
  adblockerWhitelistingForSearchURL,
  externalContactUsURL,
  financialsURL,
  privacyPolicyURL,
  searchHomeURL,
  searchExternalHelpURL,
  termsOfServiceURL,
} from 'js/navigation/navigation'
import Link from 'js/components/General/Link'

// Styles match tab-homepage style.

//  Footer link component
const footerLinkStyles = theme => ({
  footerLink: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    textDecoration: 'none',
    color: '#cecece',
    fontSize: 12,
    margin: 20,
    '&:hover': {
      color: '#838383',
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
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  classes: PropTypes.object.isRequired,
}
FooterLinkComponent.defaultProps = {}
const FooterLink = withStyles(footerLinkStyles)(FooterLinkComponent)
export { FooterLink }

// Footer component
const styles = theme => ({
  container: {
    background: 'rgba(128, 128, 128, 0.04)',
    paddingTop: 1,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
  },
  divider: {
    width: '100%',
    marginBottom: 20,
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  logoImg: {
    height: 43,
    width: 43,
  },
  textLinkContainer: {
    marginLeft: 30,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
})

class Footer extends React.Component {
  render() {
    const { classes, style } = this.props

    // Currently only for Search for a Cause. Customize if used
    // for other apps.
    return (
      <div style={style} className={classes.container}>
        <Divider className={classes.divider} />
        <div className={classes.contentContainer}>
          <Link to={searchHomeURL}>
            <img
              src={logoGrey}
              className={classes.logoImg}
              alt="Search for a Cause logo"
            />
          </Link>
          <div className={classes.textLinkContainer}>
            <FooterLink to={searchExternalHelpURL}>Help</FooterLink>
            <FooterLink to={adblockerWhitelistingForSearchURL}>
              Adblockers
            </FooterLink>
            <FooterLink to={financialsURL}>Financials</FooterLink>
            <FooterLink to={termsOfServiceURL}>Terms</FooterLink>
            <FooterLink to={privacyPolicyURL}>Privacy</FooterLink>
            <FooterLink to={externalContactUsURL}>Contact</FooterLink>
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
