import moment from 'moment'

const getSfacActivityState = async (_userContext, user) => {
  if (user.searches === 0) {
    return 'new'
  }

  if (!user.maxSearchesDay || !user.maxSearchesDay.recentDay) {
    return 'new'
  }

  const minActiveDate = moment.utc().subtract(21, 'days')
  const lastSearchDay = new Date(user.maxSearchesDay.recentDay.date)
  if (minActiveDate > lastSearchDay) {
    return 'inactive'
  }

  return 'active'
}

export default getSfacActivityState
