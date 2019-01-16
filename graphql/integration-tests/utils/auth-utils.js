/* eslint-disable */
// FIXME: update to new auth service.

export const getUser = async username => {}

export const deleteUser = async username => {}

// const createUser = async (email, username, password) => {
// }

// const logIn = async (username, password) => {
// }

/**
 * Create a new user in our auth system, log the user in, and
 *   return an object with user information.
 * @param {string} email - the user email
 * @param {string} username - the username
 * @param {string} username - the password
 * @return {object}
 */
export const createUserAndLogIn = async (email, username, password) => {}

function randomString(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export const getMockUserInfo = () => {
  const random = randomString(6)
  const username = `automatedtest+${random}`
  return {
    username,
    email: `${username}@gladly.io`,
    password: 'BadPassword123',
  }
}

/**
 * Create a new user in our auth system, log the user in, and
 *   return an object with user information.
 * @return {object}
 */
export const getNewAuthedUser = async () => {
  const mockUser = getMockUserInfo()
  const userInfo = await createUserAndLogIn(
    mockUser.email,
    mockUser.username,
    mockUser.password
  )
  return userInfo
}
