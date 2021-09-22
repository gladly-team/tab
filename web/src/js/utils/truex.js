// Docs:
// https://github.com/socialvibe/truex-ads-docs/blob/master/js_ad_api.md
// Demo:
// https://codesandbox.io/s/true-x-integration-sandbox-forked-1prqo?file=/index.js:500-514

// Initializes to window.truex
require('@truex/js-ad-client')()

// TODO: Need production value. This is currently set to our testing value.
const TRUEX_PLACEMENT_HASH = process.env.TRUEX_PLACEMENT_HASH

let initCalled = false
let trueXClient

const init = async ({ userId }) => {
  return new Promise((resolve, reject) => {
    try {
      if (!initCalled) {
        initCalled = true
        window.truex.client(
          {
            network_user_id: userId,
            partner_config_hash: TRUEX_PLACEMENT_HASH,
          },
          client => {
            resolve(client)
          }
        )
      }
    } catch (e) {
      reject(e)
    }
  })
}

const fetchTrueXAd = async () => {
  return new Promise((resolve, reject) => {
    try {
      trueXClient.requestActivity(trueXAd => {
        if (trueXAd) {
          resolve(trueXAd)
        } else {
          resolve()
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

export const requestAd = async ({ userId }) => {
  if (!trueXClient) {
    trueXClient = await init({ userId })
  }
  const trueXAd = await fetchTrueXAd()
  return { ad: trueXAd, client: trueXClient }
}
