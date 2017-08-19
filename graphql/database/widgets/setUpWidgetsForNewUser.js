
import {
  updateWidgetEnabled
} from './updateWidget'

const widgetConfigurations = [
  // Bookmarks
  {
    id: '4262cc79-d192-4435-91bd-5fda9b6f7c08',
    enabled: true
  },
  // Notes
  {
    id: '4162cc79-d192-4435-91bd-5fda9b6f7c08',
    enabled: true
  },
  // Search
  {
    id: 'ab58d2da-550b-414f-895a-7bcb2cbc9d62',
    enabled: true
  }
  // // To-dos
  // {
  //   id: 'a458d2da-550b-414f-895a-7bcb2cbc9d62',
  //   enabled: false
  // },
  // // Clock
  // {
  //   id: '426ccc79-d192-4435-91bd-5fda9b6f7c08',
  //   enabled: false
  // }
]

/**
 * Set up the default widget configuration for a new user.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<boolean>} A promise that resolves into `true`
 *   when complete
 */
export default async (userContext, userId) => {
  widgetConfigurations.forEach(async (widgetConfig) => {
    await updateWidgetEnabled(userContext, userId, widgetConfig.id,
      widgetConfig.enabled)
  })
  return true
}
