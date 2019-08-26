import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = () => ({
  container: {
    padding: 20,
    marginBottom: 26,
  },
  otherCityTimesDivider: {
    margin: '20px 0px',
  },
  otherCityTime: {
    color: 'rgba(0, 0, 0, 0.46)',
    textAlign: 'right',
  },
  otherCityTimeLocation: {
    color: 'rgba(0, 0, 0, 0.46)',
    marginLeft: 20,
  },
})

// E.g. query: "time in florida"
const TimeZoneCity = props => {
  const {
    classes,
    item: {
      otherCityTimes,
      primaryCityTime: { location, time, utcOffset },
    },
  } = props

  // If any required props are missing, don't render anything.
  if (!(location && utcOffset && time)) {
    return null
  }
  const formatDate = isoTime => moment.utc(isoTime).format('dddd, MMMM D, YYYY')
  const formatTime = isoTime => moment.utc(isoTime).format('h:mm A')
  return (
    <Paper className={classes.container} elevation={1}>
      <Typography
        variant={'h4'}
        data-test-id={'search-result-time-zone-time'}
        gutterBottom
      >
        {formatTime(time)}
      </Typography>
      <Typography
        variant={'body2'}
        data-test-id={'search-result-time-zone-date'}
      >
        {formatDate(time)}
      </Typography>
      <Typography
        variant={'body2'}
        data-test-id={'search-result-time-zone-location'}
      >
        Time in {location} ({utcOffset})
      </Typography>
      {otherCityTimes && otherCityTimes.length ? (
        <div data-test-id={'search-result-time-zone-other-locations'}>
          <Divider className={classes.otherCityTimesDivider} />
          <table>
            <tbody>
              {otherCityTimes.map(cityTime => {
                return (
                  <tr key={cityTime.location}>
                    <td>
                      <Typography
                        variant={'body2'}
                        className={classes.otherCityTime}
                        gutterBottom
                      >
                        {formatTime(cityTime.time)}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant={'body2'}
                        className={classes.otherCityTimeLocation}
                        gutterBottom
                      >
                        {cityTime.location} ({cityTime.utcOffset})
                      </Typography>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </Paper>
  )
}

TimeZoneCity.propTypes = {
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

TimeZoneCity.defaultProps = {}

const TimeZoneSearchResult = props => {
  const {
    classes,
    item: {
      otherCityTimes,
      primaryCityTime: { location, time, utcOffset },
    },
  } = props

  // Determine the type of time zone info to display.
  // TODO

  // If any required props are missing, don't render anything.
  if (!(location && utcOffset && time)) {
    return null
  }
  const formatDate = isoTime => moment.utc(isoTime).format('dddd, MMMM D, YYYY')
  const formatTime = isoTime => moment.utc(isoTime).format('h:mm A')
  return (
    <Paper className={classes.container} elevation={1}>
      <Typography
        variant={'h4'}
        data-test-id={'search-result-time-zone-time'}
        gutterBottom
      >
        {formatTime(time)}
      </Typography>
      <Typography
        variant={'body2'}
        data-test-id={'search-result-time-zone-date'}
      >
        {formatDate(time)}
      </Typography>
      <Typography
        variant={'body2'}
        data-test-id={'search-result-time-zone-location'}
      >
        Time in {location} ({utcOffset})
      </Typography>
      {otherCityTimes && otherCityTimes.length ? (
        <div data-test-id={'search-result-time-zone-other-locations'}>
          <Divider className={classes.otherCityTimesDivider} />
          <table>
            <tbody>
              {otherCityTimes.map(cityTime => {
                return (
                  <tr key={cityTime.location}>
                    <td>
                      <Typography
                        variant={'body2'}
                        className={classes.otherCityTime}
                        gutterBottom
                      >
                        {formatTime(cityTime.time)}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant={'body2'}
                        className={classes.otherCityTimeLocation}
                        gutterBottom
                      >
                        {cityTime.location} ({cityTime.utcOffset})
                      </Typography>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
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
