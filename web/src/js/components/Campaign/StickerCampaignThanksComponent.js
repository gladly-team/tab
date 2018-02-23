
import React from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import appTheme, {
  alternateAccentColor
} from 'theme/default'
import Logo from '../Logo/Logo'

class StickerCampaignThanks extends React.Component {
  render () {
    const { user } = this.props
    const anchorStyle = {
      textDecoration: 'none',
      color: alternateAccentColor
    }

    return (
      <div
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
          fontFamily: appTheme.fontFamily,
          color: appTheme.textColor
        }}
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 20,
            marginTop: 4,
            lineHeight: '140%'
          }}
        >
          <span style={{
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            <Logo style={{ height: 30, marginRight: 8 }} />
            <span>Thanks to all who spread the love!</span>
          </span>
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 14,
            marginTop: 8,
            marginBottom: 8
          }}
        >
          Thank you to all the Tabbers who got the word out this past week! A special thanks and congrats to
          the <a style={anchorStyle} href='https://www.facebook.com/notes/tab-for-a-cause/love-and-stickers-for-all/1718875268155553/' target='_blank'>
          top 10 recruiters</a>. (And if you weren't able to recruit two friends this week but still
          want a cute elephant in your life, feel free to check out
          the <a style={anchorStyle} href='https://shop.spreadshirt.com/tab-for-a-cause/' target='_blank'>Tab for a Cause shop</a>.)
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 14,
            marginTop: 8,
            marginBottom: 8
          }}
        >
          Thank you again – we rely on people like you to spread the word so we can make an even greater positive impact.
        </span>

        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              width: 280,
              marginTop: 12,
              marginBottom: 12
            }}
          > {
            (user.recruits.recruitsActiveForAtLeastOneDay >= 2)
            ? (
              <span
                data-test-id={'sticker-campaign-thanks-success'}
              >
                <span
                  style={{
                    fontSize: 14
                  }}
                >
                  Congrats, you did it! Tell us where we should send your prize:
                </span>
                <a href='https://docs.google.com/forms/d/e/1FAIpQLScVcV3EkYpkhqUG7hDGULUMJM_h57-3GnaRSg95p_UheP44dw/viewform' target='_blank'>
                  <RaisedButton
                    label='Claim Your Stickers'
                    style={{
                      display: 'block',
                      marginTop: 8
                    }}
                    primary
                  />
                </a>
              </span>
            )
            : null
          }
          </span>
        </span>
      </div>
    )
  }
}

StickerCampaignThanks.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    recruits: PropTypes.shape({
      totalRecruits: PropTypes.number,
      recruitsActiveForAtLeastOneDay: PropTypes.number
    }).isRequired
  })
}

export default StickerCampaignThanks
