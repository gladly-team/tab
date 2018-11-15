import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'

class Charity extends React.Component {
  openCharityWebsite () {
    const { charity } = this.props

    // The page might be iframed, so opening in _top or _blank is critical.
    window.open(charity.website, '_blank')
  }

  render () {
    const { charity, user, style, showError } = this.props

    return (
      <Paper
        style={Object.assign({}, {
          minWidth: 250,
          maxWidth: 360
        }, style)}
      >
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
          <Typography
            variant={'h5'}
            style={{
              padding: 16,
              display: 'block',
              textAlign: 'center'
            }}
          >
            {charity.name}
          </Typography>
          <Typography
            variant={'body2'}
            style={{
              boxSizing: 'border-box',
              paddingLeft: 16,
              paddingRight: 16,
              textAlign: 'center',
              display: 'block'
            }}
          >
            {charity.description}
          </Typography>
          <DonateHeartsControls
            charity={charity}
            user={user}
            showError={showError}
            style={{
              padding: 24
            }}
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
