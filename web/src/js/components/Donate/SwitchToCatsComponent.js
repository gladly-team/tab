import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import catImage from 'js/assets/catCharity.png'
import Button from '@material-ui/core/Button'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_NEW_USER_IS_TAB_V4_BETA } from 'js/constants'
class SwitchToCatCharity extends React.Component {
  async switchToV4() {
    await optIntoV4Beta()
    await localStorageMgr.setItem(STORAGE_NEW_USER_IS_TAB_V4_BETA, 'true')
    await SetV4BetaMutation({
      userId: this.props.user.id,
      enabled: true,
    })
    window.location.reload()
  }
  render() {
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
              alt={`Logo for the charity Tab For Cats`}
              style={{
                cursor: 'pointer',
                maxWidth: '100%',
                minWidth: '100%',
                maxHeight: '150px',
                minHeight: '150px',
              }}
              src={catImage}
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
            Help Shelter Cats (Beta)
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
            Turn your tabs into helping shelter cats get adopted!{' '}
            <span style={{ fontWeight: 'bold' }}>Still in beta:</span>
            {''} some features like widgets are missing, but you can always
            switch back to Tab for a Cause.
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
              onClick={this.switchToV4.bind(this)}
            >
              Try Tab For Cats
            </Button>
          </span>
        </span>
      </Paper>
    )
  }
}

SwitchToCatCharity.propTypes = { userId: PropTypes.string }

SwitchToCatCharity.defaultProps = {}

export default SwitchToCatCharity
