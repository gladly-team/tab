import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import switchToV4 from 'js/utils/switchToV4'

class SwitchToV4Component extends React.Component {
  async onClick() {
    const { causeId, user } = this.props
    await switchToV4({
      relayEnvironment: this.props.relay.environment,
      userId: user.id,
      causeId,
    })
  }

  render() {
    const { causeName, causeShortDesc, imgSrc, title } = this.props
    return (
      <Paper
        style={Object.assign(
          {},
          {
            minWidth: 250,
            maxWidth: 360,
            margin: 6,
          }
        )}
      >
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <span
            style={{
              padding: '10px',
            }}
          >
            <img
              alt={`Logo for the charity ${causeName}`}
              style={{
                cursor: 'pointer',
                maxWidth: '100%',
                minWidth: '100%',
                maxHeight: '150px',
                minHeight: '150px',
              }}
              src={imgSrc}
            />
          </span>
          <Typography
            variant={'h5'}
            style={{
              padding: 16,
              display: 'block',
              textAlign: 'center',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant={'body2'}
            style={{
              boxSizing: 'border-box',
              paddingLeft: 16,
              paddingRight: 16,
              textAlign: 'center',
              display: 'block',
            }}
          >
            {causeShortDesc}{' '}
            <span style={{ fontWeight: 'bold' }}>Still in beta:</span>
            {''} some features like widgets are missing, but you can always
            switch back.
          </Typography>
          <span
            style={Object.assign(
              {},
              {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 24,
                marginBottom: 20,
              }
            )}
          >
            <Button
              color={'primary'}
              variant={'contained'}
              onClick={this.onClick.bind(this)}
            >
              Try {causeName}
            </Button>
          </span>
        </span>
      </Paper>
    )
  }
}

SwitchToV4Component.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  title: PropTypes.string.isRequired, // e.g.: Help Shelter Cats (Beta)
  causeId: PropTypes.string.isRequired,
  causeName: PropTypes.string.isRequired, // e.g.: Tab for Cats
  causeShortDesc: PropTypes.string.isRequired, // e.g.: Turn your tabs into helping shelter cats get adopted!
  imgSrc: PropTypes.string.isRequired,
}

SwitchToV4Component.defaultProps = {}

export default SwitchToV4Component
