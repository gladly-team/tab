/* eslint-env jest */
let store = {}
const sortMap = (map, rev = false) => {
  return Object.entries(map).sort((a, b) => {
    const x = a[1]
    const y = b[1]
    if (rev) {
      if (x < y) return 1
      if (x > 1) return -1
    } else {
      if (x < y) return -1
      if (x > 1) return +1
    }
    return 0
  })
}

const methods = {
  clear: () => {
    store = {}
  },
  fetchRawObject: (key) => {
    return store[key]
  },
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
  zadd: (key, value) => {
    if (!(key in store)) {
      store[key] = {}
    }
    store[key][value.member] = value.score

    return 1
  },
  zrank: (key, value) => {
    const sortedEntries = sortMap(store[key])
    return sortedEntries.findIndex((element) => element[0] === value)
  },
  zrange: (key, from, to) => {
    const sortedEntries = sortMap(store[key])
    let slice = []
    if (to === -1) {
      slice = sortedEntries.slice(from)
    } else {
      slice = sortedEntries.slice(from, to + 1)
    }
    return slice.map((entry) => entry[0])
  },
  zrevrank: (key, value) => {
    const sortedEntries = sortMap(store[key], true)
    return sortedEntries.findIndex((element) => element[0] === value)
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
