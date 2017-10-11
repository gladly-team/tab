
const POST_MSG_TYPE_BACKGROUND_SETTINGS = 'background-settings'

export const postMessage = (type, data) => {
  // Important: messages sent are NOT private. If we want
  // private messages, we need to postMessage specifically
  // to each of our extensions' domains.
  window.top.postMessage({ type: type, data: data }, '*')
}

export const postBackgroundSettings = (settings) => {
  postMessage(POST_MSG_TYPE_BACKGROUND_SETTINGS, settings)
}
