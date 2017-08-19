
import {
  updateWidgetEnabled
} from './updateWidget'

const widgetConfigurations = [
  // Bookmarks
  {
    id: 'book7d35-639b-49d4-a822-116cc7e5c2e2',
    enabled: true
  },
  // Notes
  {
    id: 'notecb66-c544-465c-96e9-20646060d8d2',
    enabled: true
  },
  // Search
  {
    id: 'search0f-36c8-45d8-a91c-e5b6051b0d6d',
    enabled: true
  }
  // // To-dos
  // {
  //   id: '2dold2da-550b-414f-895a-7bcb2cbc9d62',
  //   enabled: false
  // },
  // // Clock
  // {
  //   id: 'clock49d-e16b-4635-93c5-02451bba62e6',
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
