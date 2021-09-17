// Requires true[X] tag to have loaded.
// Docs:
// https://github.com/socialvibe/truex-ads-docs/blob/master/js_ad_api.md
// Demo:
// https://codesandbox.io/s/true-x-integration-sandbox-forked-1prqo?file=/index.js:500-514

const options = {
  // TODO: hashed UID
  // Note that true[X] appears to rate-limit a user ID even
  // in the test environment.
  network_user_id: 'test_user_2',
  // TODO: env var
  partner_config_hash: '0c79a35271f1371e201a54744343a2ecf8ce9e7e',
}

let initCalled = false
let trueXClient

const init = async () => {
  return new Promise((resolve, reject) => {
    try {
      if (!initCalled) {
        initCalled = true
        window.truex.client(options, client => {
          resolve(client)
        })
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

export const requestAd = async () => {
  if (!trueXClient) {
    trueXClient = await init()
  }
  const trueXAd = await fetchTrueXAd()
  return { ad: trueXAd, client: trueXClient }
}
