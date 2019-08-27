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
  timeZoneDifferenceZoneText: {
    margin: '0px 20px 0px 0px',
    color: 'rgba(0, 0, 0, 0.46)',
  },
  timeZoneGeneralInfoTimeText: {
    color: 'rgba(0, 0, 0, 0.46)',
  },
  otherTimeZoneInfoDivider: {
    margin: '20px 0px',
  },
  otherTimeZoneInfoTime: {
    color: 'rgba(0, 0, 0, 0.46)',
    textAlign: 'right',
  },
  otherTimeZoneInfoLocation: {
    color: 'rgba(0, 0, 0, 0.46)',
    marginLeft: 20,
  },
})

const formatDate = isoTime => moment.utc(isoTime).format('dddd, MMMM D, YYYY')
const formatTime = isoTime => moment.utc(isoTime).format('h:mm A')

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

export const TimeZoneGeneralInfo = props => {
  const {
    classes,
    item: {
      primaryTimeZone: { location, time, timeZoneName, utcOffset } = {},
      otherTimeZones = [],
    } = {},
  } = props
  if (!(location && time && timeZoneName && utcOffset)) {
    return null
  }
  return (
    <Paper className={classes.container} elevation={1}>
      <Typography
        variant={'body2'}
        data-test-id={'search-result-time-zone-info-location'}
        gutterBottom
      >
        {location} ({utcOffset})
      </Typography>
      <Typography
        variant={'h4'}
        data-test-id={'search-result-time-zone-info-name'}
        gutterBottom
      >
        {timeZoneName}
      </Typography>
      <Typography
        variant={'body2'}
        className={classes.timeZoneGeneralInfoTimeText}
        gutterBottom
      >
        {formatTime(time)}
      </Typography>
      {otherTimeZones.length ? (
        <div>
          <Divider className={classes.otherTimeZoneInfoDivider} />
          <table>
            <tbody>
              {otherTimeZones.map(tzInfo => {
                return (
                  <tr key={tzInfo.location}>
                    <td>
                      <Typography
                        variant={'body2'}
                        className={classes.otherTimeZoneInfoTime}
                        gutterBottom
                      >
                        {tzInfo.utcOffset}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant={'body2'}
                        className={classes.otherTimeZoneInfoLocation}
                        gutterBottom
                      >
                        {tzInfo.location} ({tzInfo.timeZoneName})
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
TimeZoneGeneralInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    primaryTimeZone: TimeZoneInfoPropType.isRequired,
  }).isRequired,
}
TimeZoneGeneralInfo.defaultProps = {}

export const TimeZoneDifference = props => {
  const {
    classes,
    item: {
      description,
      timeZoneDifference: { location1, location2, text },
    },
  } = props

  // If a required prop is not provided, return null.
  if (!description) {
    return null
  }

  const hasLocationInfo = !!(
    location1 &&
    location1.location &&
    location1.time &&
    location1.timeZoneName &&
    location2 &&
    location2.location &&
    location2.time &&
    location2.timeZoneName
  )
  return (
    <Paper className={classes.container} elevation={1}>
      <Typography
        variant={text ? 'body2' : 'h6'}
        data-test-id={'search-result-time-zone-difference-description'}
        gutterBottom
      >
        {description}
      </Typography>
      {text ? (
        <Typography
          variant={'h4'}
          data-test-id={'search-result-time-zone-difference-text'}
          gutterBottom={hasLocationInfo}
        >
          {text}
        </Typography>
      ) : null}
      {hasLocationInfo ? (
        <table>
          <tbody>
            <tr>
              <td>
                <Typography
                  variant={'body2'}
                  className={classes.timeZoneDifferenceZoneText}
                  gutterBottom
                >
                  {location1.location} ({location1.timeZoneName})
                </Typography>
              </td>
              <td>
                <Typography
                  variant={'body2'}
                  className={classes.timeZoneDifferenceZoneText}
                  gutterBottom
                >
                  {location2.location} ({location2.timeZoneName})
                </Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography
                  variant={'body2'}
                  className={classes.timeZoneDifferenceZoneText}
                >
                  {formatTime(location1.time)}
                </Typography>
              </td>
              <td>
                <Typography
                  variant={'body2'}
                  className={classes.timeZoneDifferenceZoneText}
                >
                  {formatTime(location2.time)}
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      ) : null}
    </Paper>
  )
}
TimeZoneDifference.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timeZoneDifference: PropTypes.shape({
      location1: TimeZoneInfoPropType.isRequired,
      location2: TimeZoneInfoPropType.isRequired,
      text: PropTypes.string,
    }).isRequired,
  }).isRequired,
}
TimeZoneDifference.defaultProps = {}

export const TimeZoneTimeBetween = props => {
  const {
    classes,
    item: { description, primaryResponse },
  } = props
  return (
    <Paper className={classes.container} elevation={1}>
      <Typography
        variant={'h4'}
        data-test-id={'search-result-time-zone-primary-response'}
        gutterBottom
      >
        {primaryResponse}
      </Typography>
      <Typography
        variant={'body2'}
        data-test-id={'search-result-time-zone-description'}
      >
        {description}
      </Typography>
    </Paper>
  )
}
TimeZoneTimeBetween.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    primaryResponse: PropTypes.string.isRequired,
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
    timeZoneDifference: PropTypes.shape({
      location1: TimeZoneInfoPropType.isRequired,
      location2: TimeZoneInfoPropType.isRequired,
      text: PropTypes.string,
    }),
  }).isRequired,
}

TimeZoneSearchResult.defaultProps = {}

export default withStyles(styles)(TimeZoneSearchResult)
