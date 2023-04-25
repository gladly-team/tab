/* eslint-env jest */

const store = {}
const methods = {
  hgetall: (key) => {
    // console.log(store)
    if (!(key in store)) {
      return null
    }
    return store[key]
  },
  hget: (key, field) => {
    // console.log(store)
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
    // console.log(store)
    if (key in store) {
      delete store[key]
      return 1
    }
    return 0
  },
}

class Pipeline {
  constructor() {
    this.results = []
  }

  chain(result) {
    this.results.push(result)
    return this
  }

  hset(key, obj) {
    return this.chain(methods.hset(key, obj))
  }

  hgetall(key) {
    return this.chain(methods.hgetall(key))
  }

  exec() {
    return this.results
  }
}

module.exports = {
  Redis: () => {
    return {
      ...methods,
      multi: () => {
        return new Pipeline()
      },
    }
  },
}
