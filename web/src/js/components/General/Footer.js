import React from 'react'
import Divider from 'material-ui/Divider'
import PropTypes from 'prop-types'
import FacebookBox from 'mdi-material-ui/FacebookBox'
import Twitter from 'mdi-material-ui/Twitter'

import logoGrey from 'js/assets/logos/logo-grey.svg'
// import {
//   lightestShadingColor,
//   lighterTextColor,
//   lightestTextColor
// } from 'themes/theme'
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
import Link from 'js/components/General/NavLink'
// import IconWrapper from 'components/IconWrapper'

export const lightestShadingColor = 'rgba(128, 128, 128, 0.04)'
export const lighterTextColor = '#838383'
export const lightestTextColor = '#cecece'

const IconWrapper = props => <div>{props.children}</div>

class Footer extends React.Component {
  render () {
    const { style } = this.props
    const footerLinkStyle = {
      color: lightestTextColor,
      fontSize: 12,
      margin: 20
    }
    const hoverLinkStyle = {
      color: lighterTextColor
    }
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
            paddingRight: 40
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
              <img src={logoGrey} style={{ height: 43 }} />
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
                style={footerLinkStyle}
                hoverStyle={hoverLinkStyle}
              >
                Help
              </Link>
              <Link
                to={adblockerWhitelistingURL}
                style={footerLinkStyle}
                hoverStyle={hoverLinkStyle}
              >
                Adblockers
              </Link>
              <Link
                to={financialsURL}
                style={footerLinkStyle}
                hoverStyle={hoverLinkStyle}
              >
                Financials
              </Link>
              <Link
                to={termsOfServiceURL}
                style={footerLinkStyle}
                hoverStyle={hoverLinkStyle}
              >
                Terms
              </Link>
              <Link
                to={privacyPolicyURL}
                style={footerLinkStyle}
                hoverStyle={hoverLinkStyle}
              >
                Privacy
              </Link>
              <Link
                to={teamURL}
                style={footerLinkStyle}
                hoverStyle={hoverLinkStyle}
              >
                Team
              </Link>
              <Link
                to={contactUsURL}
                style={footerLinkStyle}
                hoverStyle={hoverLinkStyle}
              >
                Contact
              </Link>
              <Link
                to={jobsURL}
                style={footerLinkStyle}
                hoverStyle={hoverLinkStyle}
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
  style: PropTypes.object
}

Footer.defaultProps = {
  style: {}
}

export default Footer
