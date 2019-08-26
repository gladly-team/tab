import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const TimeZoneInfoPropType = PropTypes.shape({
  location: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  timeZoneName: PropTypes.string,
  utcOffset: PropTypes.string.isRequired,
})

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
export const TimeZoneCity = props => {
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
    otherCityTimes: PropTypes.arrayOf(TimeZoneInfoPropType),
    primaryCityTime: TimeZoneInfoPropType.isRequired,
  }).isRequired,
}

TimeZoneCity.defaultProps = {}

// TODO
export const TimeZoneGeneralInfo = props => {
  const { classes } = props
  return (
    <Paper className={classes.container} elevation={1}>
      TODO
    </Paper>
  )
}
TimeZoneGeneralInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}
TimeZoneGeneralInfo.defaultProps = {}

// TODO
export const TimeZoneDifference = props => {
  const { classes } = props
  return (
    <Paper className={classes.container} elevation={1}>
      TODO
    </Paper>
  )
}
TimeZoneDifference.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}
TimeZoneDifference.defaultProps = {}

// TODO
export const TimeZoneTimeBetween = props => {
  const { classes } = props
  return (
    <Paper className={classes.container} elevation={1}>
      TODO
    </Paper>
  )
}
TimeZoneTimeBetween.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}
TimeZoneTimeBetween.defaultProps = {}

const TimeZoneSearchResult = props => {
  const { item } = props
  const {
    classes,
    item: {
      description,
      primaryCityTime,
      primaryResponse,
      primaryTimeZone,
      timeZoneDifference,
    },
  } = props

  // Determine the type of time zone info to display.
  var TzComponent = null
  if (primaryCityTime) {
    TzComponent = TimeZoneCity
  } else if (timeZoneDifference) {
    TzComponent = TimeZoneDifference
  } else if (description && primaryResponse) {
    TzComponent = TimeZoneTimeBetween
  } else if (primaryTimeZone) {
    TzComponent = TimeZoneGeneralInfo
  } else {
    return null
  }
  return <TzComponent classes={classes} item={item} />
}

TimeZoneSearchResult.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    otherCityTimes: PropTypes.arrayOf(TimeZoneInfoPropType),
    primaryCityTime: TimeZoneInfoPropType,
    primaryResponse: PropTypes.string,
    primaryTimeZone: TimeZoneInfoPropType,
    text: PropTypes.string,
    timeZoneDifference: PropTypes.shape({
      location1: TimeZoneInfoPropType,
      location2: TimeZoneInfoPropType,
    }),
  }).isRequired,
}

TimeZoneSearchResult.defaultProps = {}

export default withStyles(styles)(TimeZoneSearchResult)
