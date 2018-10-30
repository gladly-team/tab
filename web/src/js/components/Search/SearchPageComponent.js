import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { isSearchPageEnabled } from 'js/utils/feature-flags'
import {
  goTo,
  dashboardURL
} from 'js/navigation/navigation'
import LogoWithText from 'js/components/Logo/LogoWithText'

const styles = theme => ({
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  bootstrapInput: {
    borderRadius: 3,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    boxShadow: '0rem 0rem 0.02rem 0.02rem rgba(0, 0, 0, 0.1)',
    fontSize: 16,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#bdbdbd',
      boxShadow: '0rem 0.05rem 0.2rem 0.04rem rgba(0, 0, 0, 0.1)'
      // borderColor: theme.palette.primary.main,
      // boxShadow: `0 0 0 0.2rem rgba(157, 75, 163, 0.25)`
    }
  },
  bootstrapFormLabel: {
    fontSize: 18
  }
})

class SearchPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchFeatureEnabled: isSearchPageEnabled()
    }
  }

  componentDidMount () {
    if (!this.state.searchFeatureEnabled) {
      goTo(dashboardURL)
    }
  }

  render () {
    const { classes } = this.props
    if (!this.state.searchFeatureEnabled) {
      return null
    }
    return (
      <div
        data-test-id={'search-page'}
        style={{
          backgroundColor: '#fff',
          minWidth: '100vw',
          minHeight: '100vh'
        }}
      >
        <div
          style={{
            backgroundColor: '#F2F2F2',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <LogoWithText
            style={{
              width: 100,
              height: 36
            }}
          />
          <div
            style={{
              maxWidth: 600,
              marginLeft: 30,
              flex: 1
            }}
          >
            <TextField
              placeholder='Search to raise money for charity...'
              fullWidth
              InputProps={{
                disableUnderline: true,
                classes: {
                  root: classes.bootstrapRoot,
                  input: classes.bootstrapInput
                }
              }}
              InputLabelProps={{
                shrink: true,
                className: classes.bootstrapFormLabel
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

SearchPage.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  app: PropTypes.shape({
    // TODO: pass these to the MoneyRaised component
    // moneyRaised: PropTypes.number.isRequired,
    // dollarsPerDayRate: PropTypes.number.isRequired
  })
}

SearchPage.defaultProps = {}

export default withStyles(styles)(SearchPage)
