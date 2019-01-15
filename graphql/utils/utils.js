import moment from 'moment'

/**
 * Determine if an argument is a valid ISO string.
 * @param {*} isoString - The argument to validate
 * @return {boolean} Whether the value of isoString is a valid ISO string.
 */
export const isValidISOString = isoString => {
  // https://stackoverflow.com/a/40069911/1332513
  return (
    typeof isoString === 'string' &&
    moment(isoString, moment.ISO_8601).isValid()
  )
}
