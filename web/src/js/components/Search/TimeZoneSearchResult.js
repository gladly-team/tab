import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = () => ({
  container: {
    padding: 20,
    marginBottom: 26,
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const TimeZoneSearchResult = props => {
  const {
    classes,
    item: {
      primaryCityTime: { location, time, utcOffset },
    },
  } = props

  // If any required props are missing, don't render anything.
  if (!(location && utcOffset && time)) {
    return null
  }
  return (
    <Paper className={classes.container} elevation={1}>
      <div>
        <Typography
          variant={'h4'}
          data-test-id={'search-result-time-zone-time'}
          gutterBottom
        >
          {moment(time).format('h:mm A')}
        </Typography>
        <Typography
          variant={'body2'}
          data-test-id={'search-result-time-zone-date'}
        >
          {moment().format('dddd, MMMM D, YYYY')}
        </Typography>
        <Typography
          variant={'body2'}
          data-test-id={'search-result-time-zone-location'}
        >
          Time in {location} ({utcOffset})
        </Typography>
      </div>
    </Paper>
  )
}

TimeZoneSearchResult.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    otherCityTimes: PropTypes.arrayOf(
      PropTypes.shape({
        location: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        utcOffset: PropTypes.string.isRequired,
      })
    ),
    primaryCityTime: PropTypes.shape({
      location: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      utcOffset: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

TimeZoneSearchResult.defaultProps = {}

export default withStyles(styles)(TimeZoneSearchResult)
