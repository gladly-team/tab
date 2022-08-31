import moment from 'moment'

const SFAC_ACTIVITY_STATES = {
  NEW: 'new',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

const getSfacActivityState = async (_userContext, user) => {
  if (user.searches === 0) {
    return SFAC_ACTIVITY_STATES.NEW
  }

  if (!user.maxSearchesDay || !user.maxSearchesDay.recentDay) {
    return SFAC_ACTIVITY_STATES.NEW
  }

  const minActiveDate = moment.utc().subtract(21, 'days')
  const lastSearchDay = new Date(user.maxSearchesDay.recentDay.date)
  if (minActiveDate > lastSearchDay) {
    return SFAC_ACTIVITY_STATES.INACTIVE
  }

  return SFAC_ACTIVITY_STATES.ACTIVE
}

export default getSfacActivityState
