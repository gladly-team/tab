/* eslint-env jest */

const store = {}
module.exports = {
  Redis: () => {
    return {
      hgetall: (key) => {
        if (!(key in store)) {
          return null
        }
        return store[key]
      },
      hget: (key, field) => {
        if (!(key in store)) {
          return null
        }
        return store[key][field] === undefined ? null : store[key][field]
      },
      hset: (key, obj) => {
        if (!(key in store)) {
          store[key] = {}
        }
        const entries = Object.entries(obj)
        for (let i = 0; i < entries.length; i += 1) {
          const [objKey, objVal] = entries[i]
          store[key][objKey] = objVal
        }
      },
      hincrby: (key, field, increment) => {
        store[key][field] += increment
      },
      del: (key) => {
        if (key in store) {
          delete store[key]
          return 1
        }
        return 0
      },
    }
  },
}
