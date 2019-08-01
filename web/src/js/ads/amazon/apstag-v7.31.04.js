/* eslint-disable */
/*! amazon-dtb-javascript-api - apstag - v7.31.04 - 2019-08-01 00:14:14 */
!(function(e) {
  var t = {}
  function r(n) {
    if (t[n]) return t[n].exports
    var o = (t[n] = { i: n, l: !1, exports: {} })
    return e[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports
  }
  ;(r.m = e),
    (r.c = t),
    (r.d = function(e, t, n) {
      r.o(e, t) ||
        Object.defineProperty(e, t, {
          configurable: !1,
          enumerable: !0,
          get: n,
        })
    }),
    (r.r = function(e) {
      Object.defineProperty(e, '__esModule', { value: !0 })
    }),
    (r.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default
            }
          : function() {
              return e
            }
      return r.d(t, 'a', t), t
    }),
    (r.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
    }),
    (r.p = ''),
    r((r.s = 15))
})([
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 })
    var n =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function(e) {
            return typeof e
          }
        : function(e) {
            return e &&
              'function' == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? 'symbol'
              : typeof e
          }
    ;(t.shouldSample = function(e) {
      try {
        var t = parseInt(e, 10)
        if (!isNaN(t)) {
          if (t <= 0) return !1
          if (t >= 100) return !0
          if (100 * Math.random() <= t) return !0
        }
        return !1
      } catch (e) {
        return !1
      }
    }),
      (t.getRandomArrayElement = function(e) {
        return a(e)[0]
      }),
      (t.shuffleArray = a),
      (t.getRand = function() {
        return '' + Math.round(1e12 * Math.random()) + Date.now()
      }),
      (t.isObject = i),
      (t.isArray = s),
      (t.getAmpAmznBidValue = function(e) {
        return 'string' != typeof e ? '' : e.split('_').pop()
      }),
      (t.safeObjectHasProp = c),
      (t.hasLocalStorage = d),
      (t.checkAllPossibleBidCacheIds = function(e, t, r) {
        return e.amzniid === t || e[r + 'amzniid'] === t || e.amzniid_sp === t
      }),
      (t.inArray = u),
      (t.isDebugEnabled = function(e) {
        return u(l(), e)
      }),
      (t.setDebugMode = function(e, t) {
        if (!d()) return !1
        var r = l()
        return (
          t && -1 === r.indexOf(e)
            ? r.push(e)
            : t ||
              (r = r.filter(function(t) {
                return t !== e
              })),
          0 === r.length
            ? window.localStorage.removeItem(o.DEBUG_LOCAL_STORAGE_KEY)
            : window.localStorage.setItem(
                o.DEBUG_LOCAL_STORAGE_KEY,
                JSON.stringify(r)
              ),
          !0
        )
      }),
      (t.getDebugValue = function(e) {
        return 'undefined' != typeof window &&
          c(window, o.DEBUG_GLOBAL) &&
          c(window[o.DEBUG_GLOBAL], e)
          ? window[o.DEBUG_GLOBAL][e]
          : ''
      })
    var o = r(1)
    function a(e) {
      var t = e.length,
        r = void 0,
        n = void 0
      for (
        e = [].concat(
          (function(e) {
            if (Array.isArray(e)) {
              for (var t = 0, r = Array(e.length); t < e.length; t++)
                r[t] = e[t]
              return r
            }
            return Array.from(e)
          })(e)
        );
        0 !== t;

      )
        (n = Math.floor(Math.random() * t)),
          (r = e[--t]),
          (e[t] = e[n]),
          (e[n] = r)
      return e
    }
    function i(e) {
      return 'object' === (void 0 === e ? 'undefined' : n(e)) && null !== e
    }
    function s(e) {
      return '[object Array]' === Object.prototype.toString.call(e)
    }
    function c(e, t) {
      return (
        i(e) &&
        Object.prototype.hasOwnProperty.call(e, t) &&
        void 0 !== e[t] &&
        '' !== e[t]
      )
    }
    function d() {
      var e = 'amzn_lsTest'
      try {
        return (
          window.localStorage.setItem(e, e),
          window.localStorage.removeItem(e),
          !0
        )
      } catch (e) {
        return !1
      }
    }
    function u(e, t) {
      return -1 !== e.indexOf(t)
    }
    function l() {
      if (!d()) return []
      var e = window.localStorage.getItem(o.DEBUG_LOCAL_STORAGE_KEY)
      null === e || 'false' === e
        ? (e = '[]')
        : 'true' === e && (e = '["fake_bids"]')
      var t = void 0
      try {
        t = JSON.parse(e)
      } catch (e) {}
      return s(t) || (t = []), t
    }
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.DISPLAY_TARGETING_KEYS = ['amznbid', 'amzniid', 'amznsz', 'amznp']),
      (t.VIDEO_TARGETING_KEYS = [
        'amznbid',
        'amzniid',
        'amznp',
        'r_amznbid',
        'r_amzniid',
        'r_amznp',
      ]),
      (t.BID_STATES = {
        new: 'NEW',
        exposed: 'EXPOSED',
        set: 'SET',
        rendered: 'RENDERED',
      }),
      (t.DEBUG_LOCAL_STORAGE_KEY = 'apstagDebug'),
      (t.DEBUG_CONSOLE_HEIGHT_KEY = 'apstagDebugHeight'),
      (t.DEBUG_GLOBAL = 'apstagDEBUG'),
      (t.CFG_LOCAL_STORAGE_KEY = 'apstagCfg'),
      (t.NO_LOCAL_STORAGE_SUPPORT_MAGIC_NUMBER_FOR_AAX = 0),
      (t.MINIMUM_BID_TIMEOUT = 0),
      (t.MOCKBID = {
        amznbid: 'testBid',
        amzniid: 'testImpression',
        amznp: 'testP',
        crid: 'testCrid',
      }),
      (t.MEDIA_TYPES_MAGIC_STRING_FOR_AAX = { video: 'v' }),
      (t.SLOT_STATE_KEYS = ['amznbid', 'amznp']),
      (t.FIRST_PARTY_COOKIE_KEYS = {
        __apsid: { urlParam: 'ck' },
        __aps_id_p: { urlParam: 'ckp' },
        aps_ext_917: { urlParam: 'st' },
      }),
      (t.SLOT_STATES = { noRequest: '0', bidInFlight: '1', noBid: '2' }),
      (t.AAX_RESP_REMAP_COOKIE_KEY = 'cr'),
      (t.SELF_SERVE_PUB_SRC = '600'),
      (t.LIBRARY_VERSION = '7.31.04'),
      (t.PROTOCOL = (function() {
        try {
          var e = window.document.location.protocol
          if ('h' === e[0]) return e + '//'
        } catch (e) {}
        return 'https://'
      })()),
      (t.HAS_XHR_SUPPORT =
        'function' == typeof XMLHttpRequest &&
        void 0 !== new XMLHttpRequest().withCredentials)
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }), (t.store = void 0)
    var n =
      Object.assign ||
      function(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t]
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
      }
    t.reducer = u
    var o = r(1),
      a = r(0)
    function i(e, t, r) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: r,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = r),
        e
      )
    }
    function s(e) {
      if (Array.isArray(e)) {
        for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t]
        return r
      }
      return Array.from(e)
    }
    var c = void 0,
      d = []
    function u() {
      var e =
          arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
        t = arguments[1]
      return {
        AAXReqs: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'RECORD_AAX_REQUEST':
              return [].concat(s(e), [n({}, t.data)])
            case 'RECORD_AAX_RESPONSE_PROP':
              return e.map(function(e) {
                return (
                  (e = n({}, e)).bidReqID === t.bidReqID &&
                    (e[t.key] = t.value),
                  e
                )
              })
            default:
              return [].concat(s(e))
          }
        })(e.AAXReqs, t),
        aaxViewabilityEnabled: (function() {
          var e =
              !(arguments.length <= 0 || void 0 === arguments[0]) &&
              arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SET_VIEWABILITY':
              return t.viewability
            default:
              return e
          }
        })(e.aaxViewabilityEnabled, t),
        bidConfigs: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {}
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'RECORD_ORIGINAL_BID_CONFIG':
              return n({}, e, i({}, t.bidConfig.bidReqID, n({}, t.bidConfig)))
            default:
              return n({}, e)
          }
        })(e.bidConfigs, t),
        bidReqs: (function() {
          var e,
            t =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {}
                : arguments[0],
            r = arguments[1]
          switch (r.type) {
            case 'ADD_CHUNKED_REQUESTS':
              return n(
                {},
                t,
                i(
                  {},
                  r.fid,
                  n({}, t[r.fid], { networkReqs: new Array(r.numChunks) })
                )
              )
            case 'NEW_FETCH_BID_REQUEST':
              return n(
                {},
                t,
                i({}, r.fid, { pto: r.pto, hasCallbackExecuted: !1 })
              )
            case 'RECORD_CALLBACK':
              return n(
                {},
                t,
                i({}, r.fid, n({}, t[r.fid], { hasCallbackExecuted: !0 }))
              )
            case 'RECORD_NETWORK_EXCHANGE':
              return n(
                {},
                t,
                i(
                  {},
                  r.fid,
                  n({}, t[r.fid], {
                    networkReqs: n(
                      [].concat(s(t[r.fid].networkReqs)),
                      i(
                        {},
                        r.networkID,
                        n(
                          {},
                          t[r.fid].networkReqs[r.networkID],
                          ((e = {}),
                          i(e, r.exchangeType + 'Time', r.timestamp),
                          i(e, 'inFlight', 'request' === r.exchangeType),
                          e)
                        )
                      )
                    ),
                  })
                )
              )
            case 'RECORD_TIMEOUT':
              return n(
                {},
                t,
                i(
                  {},
                  r.fid,
                  n({}, t[r.fid], {
                    networkReqs: t[r.fid].networkReqs.map(function(e) {
                      return e.inFlight ? n({}, e, { timeOut: r.timeOut }) : e
                    }),
                  })
                )
              )
            default:
              return n({}, t)
          }
        })(e.bidReqs, t),
        bsPixels: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {}
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'RECORD_BID_INFO_SENT':
              return n({}, e, i({}, t.bidInfo.iid, t.bidInfo.state))
            default:
              return n({}, e)
          }
        })(e.bsPixels, t),
        cfg: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {
                    CSM_JS: '//c.amazon-adsystem.com/aax2/csm.js.gz',
                    CSM_RTB_COMMUNICATOR_JS:
                      '//c.amazon-adsystem.com/bao-csm/aps-comm/aps_csm.js',
                    DEBUG_APP_HTML:
                      '//c.amazon-adsystem.com/aax2/debugApp.html',
                    DEFAULT_TIMEOUT: 2e3,
                    DTB_PATH: '/e/dtb',
                    PIXEL_PATH: '/x/px/',
                    LATENCY_SAMPLING_RATE: 1,
                    COOKIE_MATCH_DELAY: 0,
                    MAX_SLOTS_PER_REQUEST: 1,
                    CF_ROUTING_RATE: 100,
                  }
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SET_CFG':
              return n({}, e, t.cfg)
            default:
              return n({}, e)
          }
        })(e.cfg, t),
        cmpFired: (function() {
          var e =
            !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0]
          switch (arguments[1].type) {
            case 'CMP_FIRED':
              return !0
            default:
              return e
          }
        })(e.cmpFired, t),
        config: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {}
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SET_CONFIG':
              return n({}, t.config, {
                gdpr: n({ cmpTimeout: t.defaultCmpTimeout }, t.config.gdpr),
                isSelfServePub: t.config.pubID && t.config.pubID.length >= 5,
              })
            default:
              return n({}, e)
          }
        })(e.config, t),
        displayAdServer: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? { noBidSlotIDs: [] }
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SLOT_RENDER_ENDED_SET':
              return n({}, e, { slotRenderEndedSet: !0 })
            case 'NO_BID_ON_ADSERVER_SLOTS':
              return n({}, e, {
                noBidSlotIDs: e.noBidSlotIDs.concat(t.slotIDs),
              })
            case 'REQUESTED_BID_FOR_ADSERVER_SLOTS':
              return n({}, e, {
                noBidSlotIDs: e.noBidSlotIDs.filter(function(e) {
                  return !(0, a.inArray)(t.slotIDs, e)
                }),
              })
            default:
              return n({}, e, { noBidSlotIDs: [].concat(s(e.noBidSlotIDs)) })
          }
        })(e.displayAdServer, t),
        eventLog: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'LOG_EVENT':
              return [].concat(s(e), [n({}, t.event)])
            default:
              return [].concat(s(e))
          }
        })(e.eventLog, t),
        experiments: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {}
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SHOULD_CHUNK_REQUESTS':
              return n(
                { chunkRequests: !0 === e.shouldSampleLatency && t.value },
                e
              )
            case 'SHOULD_CF_ROUTE':
              return n({}, e, { shouldCFRoute: t.value })
            case 'SHOULD_SAMPLE_LATENCY':
              return n({}, e, { shouldSampleLatency: t.value })
            default:
              return n({}, e)
          }
        })(e.experiments, t),
        gamLog: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'LOG_GAM_EVENT':
              return [].concat(s(e), [n({}, t.event)])
            default:
              return [].concat(s(e))
          }
        })(e.gamLog, t),
        gdpr: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? null
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SET_GDPR_CONFIG':
              return null === t.config ? null : n({}, t.config)
            default:
              return null === e ? e : n({}, e)
          }
        })(e.gdpr, t),
        gdprQue: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'ADD_GDPR_QUE_ITEM':
              return [].concat(s(e), [t.func])
            case 'CLEAR_GDPR_QUE':
              return []
            default:
              return [].concat(s(e))
          }
        })(e.gdprQue, t),
        hosts: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {
                    DEFAULT_AAX_BID_HOST:
                      (0, a.getDebugValue)('host') || 'aax.amazon-adsystem.com',
                    DEFAULT_AAX_PIXEL_HOST:
                      (0, a.getDebugValue)('host') || 'aax.amazon-adsystem.com',
                  }
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SET_HOST':
              return n({}, e, i({}, t.hostName, t.hostValue))
            default:
              return n({}, e)
          }
        })(e.hosts, t),
        Q: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SET_Q':
              return [].concat(s(t.Q))
            default:
              return [].concat(s(e))
          }
        })(e.Q, t),
        slotBids: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {}
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'BID_STATE_CHANGE':
              return n(
                {},
                e,
                i(
                  {},
                  t.slotID,
                  e[t.slotID].map(function(e) {
                    var r = {}
                    return (
                      (0, a.checkAllPossibleBidCacheIds)(
                        e,
                        t.bidID,
                        t.dealId
                      ) &&
                        ((r.bidState = t.bidState),
                        t.bidState === o.BID_STATES.rendered
                          ? (r.renderTime = t.ts)
                          : t.bidState === o.BID_STATES.set &&
                            (r.setAtTimes = (0, a.safeObjectHasProp)(
                              e,
                              'setAtTimes'
                            )
                              ? [].concat(s(e.setAtTimes), [t.ts])
                              : [t.ts])),
                      n({}, e, r)
                    )
                  })
                )
              )
            case 'UPDATE_BID_INFO_PROP':
              return void 0 === e[t.slotID] ||
                e[t.slotID].filter(function(e) {
                  return (0, a.checkAllPossibleBidCacheIds)(e, t.iid, t.dealId)
                }).length < 1
                ? n({}, e)
                : n(
                    {},
                    e,
                    i(
                      {},
                      t.slotID,
                      e[t.slotID].map(function(e) {
                        return (
                          (e = n({}, e)),
                          (0, a.checkAllPossibleBidCacheIds)(
                            e,
                            t.iid,
                            t.dealId
                          ) && (e[t.key] = t.value),
                          e
                        )
                      })
                    )
                  )
            case 'UPDATE_SLOT_BIDS':
              return n(
                {},
                e,
                t.bids.reduce(function(t, r) {
                  return (
                    (0, a.safeObjectHasProp)(t, r.slotID)
                      ? (t[r.slotID] = [].concat(s(t[r.slotID]), [n({}, r)]))
                      : (0, a.safeObjectHasProp)(e, r.slotID)
                      ? (t[r.slotID] = [].concat(s(e[r.slotID]), [n({}, r)]))
                      : (t[r.slotID] = [n({}, r)]),
                    t
                  )
                }, {})
              )
            default:
              return n({}, e)
          }
        })(e.slotBids, t),
        sync917: (function() {
          var e =
              !(arguments.length <= 0 || void 0 === arguments[0]) &&
              arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'SET_SYNC_917':
              return t.value
            default:
              return e
          }
        })(e.sync917, t),
        targetingKeys: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {}
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'UPDATE_SLOT_BIDS':
              return n(
                {},
                e,
                t.bids.reduce(function(t, r) {
                  return (
                    (0, a.safeObjectHasProp)(e, r.slotID)
                      ? (t[r.slotID] = [].concat(
                          s(e[r.slotID]),
                          s(
                            (r.targeting
                              ? r.targeting
                              : o.DISPLAY_TARGETING_KEYS
                            ).filter(function(t) {
                              return -1 === e[r.slotID].indexOf(t)
                            })
                          )
                        ))
                      : (t[r.slotID] = r.targeting
                          ? r.targeting
                          : o.DISPLAY_TARGETING_KEYS),
                    t
                  )
                }, {})
              )
            default:
              return n({}, e)
          }
        })(e.targetingKeys, t),
        tests: (function() {
          var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? {}
                : arguments[0],
            t = arguments[1]
          switch (t.type) {
            case 'UPDATE_TEST':
              return n(
                {},
                e,
                i({}, t.id, { name: t.name, status: t.status, case: t.case })
              )
            default:
              return n({}, e)
          }
        })(e.tests, t),
      }
    }
    var l = {
      getState: function() {
        return c
      },
      dispatch: function(e) {
        ;(c = u(c, e)),
          d.forEach(function(e) {
            return e()
          })
      },
      subscribe: function(e) {
        d.push(e)
      },
    }
    ;(0, a.isDebugEnabled)('redux') &&
      (0, a.hasLocalStorage)() &&
      (0, a.safeObjectHasProp)(window, '__REDUX_DEVTOOLS_EXTENSION__') &&
      (t.store = l = window.__REDUX_DEVTOOLS_EXTENSION__(u)),
      l.dispatch({ type: 'NOOP' }),
      (t.store = l)
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.pixels = t.pixelQueue = void 0),
      (t.noBidCacheIdPixel = function(e) {
        return u(d() + 'p/PH/' + c(e))
      }),
      (t.bidCacheIdPixel = function(e, t) {
        return u('' + d() + e + '/' + c(t))
      }),
      (t.sendPixels = function() {
        i || ((i = !0), a.forEach(u))
      }),
      (t.resetSendPixels = function() {
        ;(i = !1), (t.pixels = s = []), (t.pixelQueue = a = [])
      })
    var n = r(1),
      o = r(2),
      a = (t.pixelQueue = []),
      i = !1,
      s = (t.pixels = [])
    function c(e) {
      e._tl = 'aps-tag'
      var t = JSON.stringify(e)
      return (t = t.replace(/\\.{1}/g, '')), encodeURIComponent(t)
    }
    function d() {
      var e = o.store.getState(),
        t = e.cfg.PIXEL_PATH,
        r = e.hosts.DEFAULT_AAX_PIXEL_HOST
      return '' + n.PROTOCOL + r + t
    }
    function u(e) {
      if (i) {
        var t = new Image()
        return (t.src = e), s.push(t), t
      }
      return a.push(e), e
    }
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.reportError = p),
      (t.wrapFunction = function(e, t) {
        return function() {
          try {
            return e.apply(null, arguments)
          } catch (e) {
            return p(e, t), null
          }
        }
      }),
      (t.consoleWarn = function(e) {
        ;((!(arguments.length <= 1 || void 0 === arguments[1]) &&
          arguments[1]) ||
          (0, n.isDebugEnabled)('errors')) &&
          window[c][u](e)
      })
    var n = r(0),
      o = r(1),
      a = r(3),
      i = r(2),
      s = (0, n.shouldSample)(10),
      c = 'console',
      d = 'error',
      u = 'warn',
      l = void 0,
      f = void 0
    function p(e, t, r) {
      try {
        if (((r || (0, n.isDebugEnabled)('errors')) && window[c][d](e), !s))
          return !1
        var u = {
          lv: o.LIBRARY_VERSION,
          ts: Date.now(),
          url: encodeURIComponent(window.document.documentURI),
          r: encodeURIComponent(window.document.referrer),
          _type: 'apstagError',
          e: { et: e.name, el: t, msg: e.message },
        }
        if (void 0 === l) {
          var p = i.store.getState()
          void 0 !== p &&
            void 0 !== p.config &&
            ((l = p.config.isSelfServePub), (f = p.config.pubID))
        }
        return (
          void 0 !== l &&
            (l ? ((u.src = o.SELF_SERVE_PUB_SRC), (u.pubid = f)) : (u.src = f)),
          (0, a.noBidCacheIdPixel)(u),
          !0
        )
      } catch (e) {}
      return !1
    }
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.GDPR = t.cmpLocalStorageChanged = t.cmpResponseKey = void 0)
    var n =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function(e) {
              return typeof e
            }
          : function(e) {
              return e &&
                'function' == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? 'symbol'
                : typeof e
            },
      o =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
          }
          return e
        },
      a = r(0),
      i = r(4)
    Number.isInteger =
      Number.isInteger ||
      function(e) {
        return 'number' == typeof e && isFinite(e) && Math.floor(e) === e
      }
    var s = (t.cmpResponseKey = 'cmpRTimesA'),
      c = (t.cmpLocalStorageChanged = 'crfgL0cSt0rC')
    t.GDPR = function(e, t) {
      e = o({}, e)
      var r = void 0,
        d = 50,
        u = [1, 1, 3, 5],
        l = 0,
        f = !1,
        p = 'crfgL0cSt0r',
        g = !1,
        m = 'cmp-timeout'
      try {
        var _ = (function() {
          t = (0, i.wrapFunction)(t, 'GdprCallback')
          var _ = function(e) {
              try {
                if (!(0, a.hasLocalStorage)()) return
                window.localStorage.setItem(c, '0'),
                  (!1 !== g &&
                    g.enabled === e.enabled &&
                    g.consent === e.consent) ||
                    (window.localStorage.setItem(c, '2'),
                    window.localStorage.setItem(
                      p,
                      JSON.stringify({ enabled: e.enabled, consent: e.consent })
                    ),
                    !1 !== g &&
                      ((S.lsStatus = 'cmp-override'),
                      window.localStorage.setItem(c, '1'))),
                  (window.document.cookie = p + '=true;max-age=604800')
              } catch (e) {
                return void (0, i.reportError)(e, '__gdpr_save__')
              }
            },
            b = function(e) {
              try {
                ;(e = o({}, e)),
                  Object.keys(e.log).map(function(t) {
                    'string' == typeof e.log[t] &&
                      -1 !== e.log[t].indexOf('/') &&
                      (e.log[t] = encodeURIComponent(e.log[t]))
                  }),
                  (e.log = JSON.stringify(e.log))
              } catch (e) {
                ;(0, i.reportError)(e, '__gdpr_stringify_log__')
              }
              t(e)
            }
          ;('object' === (void 0 === e ? 'undefined' : n(e)) && null !== e) ||
            (e = {})
          var S = {
            cmpGlobal: e.cmpGlobal,
            cmpTimeout: e.cmpTimeout,
            enabled: e.enabled,
          }
          !1 === e.enabled
            ? (S.status = 'explicit-no-gdpr')
            : !0 === e.enabled &&
              (S.status =
                void 0 !== e.consent
                  ? 'explicit-consent-passed'
                  : 'explicit-no-consent-passed'),
            (0, a.hasLocalStorage)() &&
              (g = (function() {
                try {
                  var e = window.localStorage.getItem(p)
                  return null !== e && JSON.parse(e)
                } catch (e) {
                  return (0, i.reportError)(e, '__gdpr_parse_ls__'), !1
                }
              })()),
            !1 !== g &&
              (void 0 === window.document.cookie ||
              -1 === window.document.cookie.indexOf(p + '=true')
                ? ((g = !1), (S.lsStatus = 'invalid'))
                : ((S.lsStatus = 'present'),
                  (d = 50),
                  (m = 'cmp-timeout-cfb'))),
            'string' != typeof e.cmpGlobal && (e.cmpGlobal = '__cmp'),
            Number.isInteger(e.cmpTimeout) || (e.cmpTimeout = d)
          var h,
            E,
            v = ((E = { log: S }),
            void 0 === (h = e).enabled
              ? E
              : !1 === h.enabled
              ? ((E.enabled = 0), E)
              : (Number.isInteger(h.enabled)
                  ? (E.enabled = h.enabled)
                  : (E.enabled = 1),
                'string' == typeof h.consent && (E.consent = h.consent),
                E))
          if (void 0 !== v.enabled) return b(v), { v: void 0 }
          !1 !== g && (v = o({}, g, v)),
            !1 === g ||
              (g.enabled === v.enabled && g.consent === v.consent) ||
              (S.lsStatus = 'pub-override'),
            (function e(t, n) {
              if (
                !(0, a.safeObjectHasProp)(window, t.cmpGlobal) ||
                'function' != typeof window[t.cmpGlobal]
              )
                return (
                  n({ error: 'no-cmp' }),
                  void (l < u.length && (setTimeout(e, 1e3 * u[l], t, n), l++))
                )
              setTimeout(n, t.cmpTimeout, { timeout: !0 }, !0), (r = Date.now())
              try {
                window[t.cmpGlobal]('getConsentData', null, n)
              } catch (e) {
                n({ error: 'cmp-internal-error' }),
                  (0, i.reportError)(e, '__gdpr_cmp__')
              }
            })(
              e,
              function(e, t, o) {
                if (
                  !f ||
                  'object' !== (void 0 === t ? 'undefined' : n(t)) ||
                  null === t ||
                  !t.timeout
                ) {
                  f = !0
                  try {
                    return 'object' === (void 0 === t ? 'undefined' : n(t)) &&
                      null !== t &&
                      void 0 !== t.error
                      ? ((S.status = t.error), void b(e))
                      : o &&
                        'object' === (void 0 === t ? 'undefined' : n(t)) &&
                        null !== t
                      ? t.timeout
                        ? ((S.status = m), void b(e))
                        : ((function(e) {
                            if ((0, a.hasLocalStorage)())
                              try {
                                var t = window.localStorage.getItem(s)
                                ;(t = null !== t ? JSON.parse(t) : []).push(e),
                                  window.localStorage.setItem(
                                    s,
                                    JSON.stringify(t)
                                  )
                              } catch (e) {
                                ;(0, i.reportError)(e, '__gdpr_save_time__')
                              }
                          })(Date.now() - r),
                          (S.status = 'success'),
                          t.gdprApplies
                            ? ((e.enabled = 1),
                              (e.consent = t.consentData),
                              _(e),
                              void b(e))
                            : ((e.enabled = 0),
                              delete e.consent,
                              _(e),
                              void b(e)))
                      : ((S.status = 'cmp-error'), void b(e))
                  } catch (t) {
                    return (
                      (0, i.reportError)(t, '__gdpr_cmp_callback__'),
                      (S.status = 'func-error'),
                      void b(e)
                    )
                  }
                }
              }.bind(null, v)
            )
        })()
        if ('object' === (void 0 === _ ? 'undefined' : n(_))) return _.v
      } catch (e) {
        f || t({ log: '{"status":"global-func-error"}' }),
          (f = !0),
          (0, i.reportError)(e, '__gdpr_global_func__')
      }
    }
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.xhrGet = function(e) {
        var t = e.url,
          r = e.onload,
          o = e.onerror,
          a = void 0 === o ? null : o,
          i = e.ontimeout,
          s = void 0 === i ? null : i,
          c = e.withCredentials,
          d = void 0 === c ? null : c
        try {
          var u = new window.XMLHttpRequest()
          ;(u.onload = r.bind(null, u)),
            null !== a && (u.onerror = a),
            null !== s && (u.ontimeout = s),
            null !== d && (u.withCredentials = d),
            u.open('GET', t),
            u.send(null)
        } catch (e) {
          ;(0, n.reportError)(e, '__xhrGet__')
        }
      }),
      (t.loadScriptTag = function(e, t) {
        var r =
          arguments.length <= 2 || void 0 === arguments[2] ? null : arguments[2]
        try {
          if ((null === r && (r = document), void 0 === e))
            return 'function' == typeof t && t(!0), !1
          var a = r.getElementsByTagName('script')[0] || r.body.firstChild,
            i = r.createElement('script')
          return (
            (i.type = 'text/javascript'),
            (i.async = !0),
            (i.src = e),
            t && o(i, t),
            a.parentNode.insertBefore(i, a),
            !0
          )
        } catch (e) {
          return (0, n.reportError)(e, '__loadScriptTag__'), !1
        }
      }),
      (t.addOnLoadFunction = o)
    var n = r(4)
    function o(e, t) {
      var r =
        arguments.length <= 2 || void 0 === arguments[2] ? [] : arguments[2]
      try {
        return (
          'function' == typeof t &&
          (e.readyState
            ? ((e.onreadystatechange = function() {
                ;-1 !== ['loaded', 'complete'].indexOf(e.readyState) &&
                  ((e.onreadystatechange = null), t.apply(null, r))
              }),
              !0)
            : ((e.onload = function() {
                t.apply(null, r)
              }),
              !0))
        )
      } catch (e) {
        return (0, n.reportError)(e, '__addOnLoadFunction__'), !1
      }
    }
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.displayAdServerSAS = void 0)
    var n = r(0),
      o = {
        isSupported: !0,
        needNewBidObject: !0,
        cmdQueuePush: function(e) {
          window.sas.cmd.push(e)
        },
        setTargeting: function() {},
        getTargeting: function() {
          return []
        },
        clearTargeting: function() {},
        slotRenderEndedEvent: function() {},
        hasAdServerObjectLoaded: function() {
          return (
            (0, n.safeObjectHasProp)(window, 'sas') &&
            (0, n.safeObjectHasProp)(window.sas, '__smartLoaded') &&
            !0 === window.sas.__smartLoaded
          )
        },
        isCommandQueueDefined: function() {
          return (
            !!(0, n.safeObjectHasProp)(window, 'sas') &&
            (0, n.safeObjectHasProp)(window.sas, 'cmd')
          )
        },
        getSlotElementId: function() {},
        getSlots: function() {
          return []
        },
        appendTargeting: function(e) {
          e.forEach(function(e) {
            ;(0, n.safeObjectHasProp)(e, 'slotID') &&
              e.slotID.indexOf('_') > -1 &&
              (e.sasTargeting = e.helpers.targetingKeys.reduce(function(t, r) {
                return (
                  t.length > 0 && (t += ';'),
                  t + r + '_' + e.slotID.split('_')[1] + '=' + e.targeting[r]
                )
              }, ''))
          })
        },
      }
    t.displayAdServerSAS = o
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.displayAdServerDefault = {
        isSupported: !1,
        needNewBidObject: !1,
        cmdQueuePush: function() {},
        setToBeginningOfCmdQueue: function() {},
        setTargeting: function() {},
        getTargeting: function() {
          return []
        },
        clearTargeting: function() {},
        slotRenderEndedEvent: function() {},
        hasAdServerObjectLoaded: function() {},
        isCommandQueueDefined: function() {},
        getSlotElementId: function() {},
        getSlots: function() {
          return []
        },
        appendTargeting: function() {},
      })
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.displayAdServerGoogletag = void 0)
    var n = r(0),
      o = {
        isSupported: !0,
        needNewBidObject: !1,
        cmdQueuePush: function(e) {
          googletag.cmd.push(e)
        },
        setTargeting: function(e, t, r) {
          void 0 === r
            ? googletag.pubads().setTargeting(e, t)
            : r.setTargeting(e, t)
        },
        getTargeting: function(e, t) {
          return void 0 === t
            ? googletag.pubads().getTargeting(e)
            : t.getTargeting(e)
        },
        clearTargeting: function(e, t) {
          void 0 === t
            ? googletag.pubads().clearTargeting(e)
            : t.clearTargeting(e)
        },
        slotRenderEndedEvent: function(e) {
          googletag.pubads().addEventListener('slotRenderEnded', e)
        },
        hasAdServerObjectLoaded: function() {
          return (
            'undefined' != typeof googletag &&
            (0, n.safeObjectHasProp)(googletag, 'apiReady') &&
            !0 === googletag.apiReady
          )
        },
        isCommandQueueDefined: function() {
          return 'undefined' != typeof googletag && void 0 !== googletag.cmd
        },
        getSlotElementId: function(e) {
          return e.getSlotElementId()
        },
        getSlots: function() {
          return googletag.pubads().getSlots()
        },
        appendTargeting: function() {},
      }
    t.displayAdServerGoogletag = o
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.displayAdServerAppNexus = void 0)
    var n = r(0),
      o = {
        isSupported: !0,
        needNewBidObject: !1,
        cmdQueuePush: function(e) {
          window.apntag.anq.push(e)
        },
        setTargeting: function(e, t, r) {
          void 0 === r
            ? (window.apntag.requests.keywords[e] = t)
            : (r.keywords[e] = t)
        },
        getTargeting: function(e, t) {
          var r
          return (
            void 0 === t
              ? ((0, n.safeObjectHasProp)(window.apntag.requests, 'keywords') ||
                  (window.apntag.requests.keywords = {}),
                (r = window.apntag.requests.keywords[e]))
              : ((0, n.safeObjectHasProp)(t, 'keywords') || (t.keywords = {}),
                (r = t.keywords[e])),
            void 0 === r ? [] : [r]
          )
        },
        clearTargeting: function(e, t) {
          void 0 === t
            ? delete window.apntag.requests.keywords[e]
            : delete t.keywords[e]
        },
        slotRenderEndedEvent: function(e) {
          window.apntag.onEvent('adLoaded', e)
        },
        hasAdServerObjectLoaded: function() {
          return (
            void 0 !== window.apntag &&
            (0, n.safeObjectHasProp)(window.apntag, 'loaded') &&
            !0 === window.apntag.loaded
          )
        },
        isCommandQueueDefined: function() {
          return void 0 !== window.apntag && void 0 !== window.apntag.anq
        },
        getSlotElementId: function(e) {
          return e.targetId
        },
        getSlots: function() {
          return Object.keys(window.apntag.requests.tags).map(function(e) {
            return window.apntag.requests.tags[e]
          })
        },
        appendTargeting: function() {},
      }
    t.displayAdServerAppNexus = o
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 }),
      (t.enableDebugConsole = function() {
        var e =
          !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0]
        if (
          ((0, o.setDebugMode)('console', !0),
          0 !== n.store.getState().eventLog.length || e)
        ) {
          if (null === c) {
            var t = {
              url: n.store.getState().cfg.DEBUG_APP_HTML,
              onload: f,
              onerror: console.error,
            }
            ;(0, i.xhrGet)(t),
              setTimeout(function() {
                var t = { _type: 'debugLoad', onstart: e ? 1 : 0 },
                  r = n.store.getState().config.pubID
                void 0 !== r && (t.src = r), (0, s.noBidCacheIdPixel)(t)
              }, 5e3)
          }
        } else window.location.reload()
      }),
      (t.disableDebugConsole = function() {
        ;(0, o.setDebugMode)('console', !1),
          null !== c && document.body.removeChild(c),
          (c = null),
          (d = null),
          (u = null),
          (0, o.hasLocalStorage)() &&
            window.localStorage.removeItem(a.DEBUG_CONSOLE_HEIGHT_KEY)
      })
    var n = r(2),
      o = r(0),
      a = r(1),
      i = r(6),
      s = r(3),
      c = null,
      d = null,
      u = null,
      l = null
    function f(e) {
      var t = e.responseText
      ;(c = document.createElement('div')),
        (d = document.createElement('div')),
        (u = document.createElement('iframe'))
      var r = 200
      ;(0, o.hasLocalStorage)() &&
        null !== window.localStorage.getItem(a.DEBUG_CONSOLE_HEIGHT_KEY) &&
        (r = window.localStorage.getItem(a.DEBUG_CONSOLE_HEIGHT_KEY)),
        (c.style =
          'background: #eaeded;z-index: 2147483647;bottom: 0;position: fixed !important;display: block !important;left: 0;right: 0;height: ' +
          r +
          'px;'),
        (d.style =
          'cursor: row-resize;height: 2px;position: absolute;top: 0;left: 0;right: 0;background-color: RGBA(0,0,0,0);'),
        c.appendChild(d),
        (u.frameBorder = 0),
        (u.marginHeight = 0),
        (u.marginWidth = 0),
        (u.topMargin = 0),
        (u.leftMargin = 0),
        (u.scrolling = 'no'),
        (u.allowTransparency = !0),
        (u.id = 'apstag-debug-iframe'),
        (u.src = 'about:blank'),
        (u.style = 'display: block; width: 100%; height: ' + r + 'px;'),
        c.appendChild(u),
        document.body.appendChild(c),
        u.contentDocument.open(),
        u.contentDocument.write(t),
        u.contentDocument.close(),
        d.addEventListener('mousedown', m)
    }
    function p(e) {
      var t = window.innerHeight - e.clientY
      return (
        t < 200 && (t = 200),
        (c.style.height = t + 'px'),
        (u.style.height = t + 'px'),
        t
      )
    }
    function g(e) {
      return (
        e.stopPropagation && e.stopPropagation(),
        e.preventDefault && e.preventDefault(),
        (e.cancelBubble = !0),
        (e.returnValue = !1),
        !1
      )
    }
    function m() {
      ;((l = document.createElement('div')).style =
        'position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 9999999999;'),
        c.appendChild(l),
        window.addEventListener('mouseup', b),
        window.addEventListener('mousemove', _)
    }
    function _(e) {
      return p(e), g(e)
    }
    function b(e) {
      null !== l && (c.removeChild(l), (l = null)),
        window.removeEventListener('mousemove', _),
        window.removeEventListener('mouseup', b)
      var t = p(e)
      return (
        (0, o.hasLocalStorage)() &&
          window.localStorage.setItem(a.DEBUG_CONSOLE_HEIGHT_KEY, t),
        g(e)
      )
    }
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 })
    var n =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function(e) {
            return typeof e
          }
        : function(e) {
            return e &&
              'function' == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? 'symbol'
              : typeof e
          }
    ;(t.getMetricFromPerformanceObject = a),
      (t.getResourcePerformanceObject = function(e, t) {
        try {
          var r = e.performance
            .getEntriesByType('resource')
            .filter(function(e) {
              return -1 !== e.name.indexOf(t)
            })[0]
          return void 0 === r ? null : r
        } catch (e) {
          return null
        }
      }),
      (t.getWindowPerformanceMetric = function(e, t) {
        try {
          var r = e.performance.timing[t]
          return void 0 === r ? o : r
        } catch (e) {
          return o
        }
      }),
      (t.isResourceCached = function(e) {
        try {
          var t = (function() {
            if (
              0 ===
              [
                'redirectStart',
                'redirectEnd',
                'domainLookupStart',
                'domainLookupEnd',
                'connectStart',
                'connectEnd',
                'requestStart',
                'responseStart',
                'secureConnectionStart',
              ].reduce(function(t, r) {
                return t + a(e, r)
              }, 0)
            )
              return { v: null }
            var t = a(e, 'fetchStart')
            return {
              v: [
                'domainLookupStart',
                'domainLookupEnd',
                'connectStart',
                'connectEnd',
              ].reduce(function(r, n) {
                return r && a(e, n) === t
              }, !0),
            }
          })()
          if ('object' === (void 0 === t ? 'undefined' : n(t))) return t.v
        } catch (e) {
          return null
        }
      }),
      (t.getTimeOrigin = function() {
        try {
          var e = window.performance.timeOrigin
          return (
            void 0 === e && (e = window.performance.timing.navigationStart), e
          )
        } catch (e) {
          return o
        }
      })
    var o = 0
    function a(e, t) {
      try {
        return 'number' != typeof e[t] ? o : Math.round(e[t])
      } catch (e) {
        return o
      }
    }
  },
  function(e, t, r) {
    'use strict'
    Object.defineProperty(t, '__esModule', { value: !0 })
    var n =
      Object.assign ||
      function(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t]
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
        }
        return e
      }
    t.default = function(e) {
      var t = this,
        r = e.run,
        s = e.cases,
        c = e.name,
        d = e.sample,
        u = void 0 === d ? 1 : d,
        l = e.delay,
        f = void 0 === l ? 5e3 : l,
        p = e.pixelTemplate,
        g = void 0 === p ? {} : p
      this.testId = (0, a.getRand)()
      var m = function(e) {
          _('pixeling'),
            ((e = n({}, g, e))._type = encodeURIComponent(c + '-tst')),
            Object.keys(s).length > 1 &&
              (e._case = encodeURIComponent(t.runningCase)),
            (0, i.noBidCacheIdPixel)(e),
            _('done')
        },
        _ = function(e) {
          ;(t.status = e),
            o.store.dispatch({
              type: 'UPDATE_TEST',
              id: t.testId,
              status: t.status,
              name: t.name,
              case: t.runningCase,
            })
        }
      ;(this.name = c),
        (this.sampleRate = u),
        (this.runningCase = ''),
        (this.status = ''),
        _('config'),
        _('waiting'),
        setTimeout(function() {
          'string' == typeof u && (u = o.store.getState().cfg[u]),
            (0, a.shouldSample)(u)
              ? (_('setup'),
                (t.runningCase = (0, a.getRandomArrayElement)(Object.keys(s))),
                _('running'),
                r(m, s[t.runningCase]))
              : _('nosample')
        }, f)
    }
    var o = r(2),
      a = r(0),
      i = r(3)
  },
  function(e, t, r) {
    'use strict'
    var n =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t]
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
          }
          return e
        },
      o =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function(e) {
              return typeof e
            }
          : function(e) {
              return e &&
                'function' == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? 'symbol'
                : typeof e
            },
      a = r(13),
      i = h(a),
      s = r(5),
      c = r(2),
      d = r(0),
      u = r(1),
      l = r(12),
      f = r(3),
      p = r(4),
      g = r(11),
      m = r(6),
      _ = r(10),
      b = r(9),
      S = r(8),
      E = r(7)
    function h(e) {
      return e && e.__esModule ? e : { default: e }
    }
    function v(e, t, r) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: r,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = r),
        e
      )
    }
    function y(e, t) {
      var r = {}
      for (var n in e)
        t.indexOf(n) >= 0 ||
          (Object.prototype.hasOwnProperty.call(e, n) && (r[n] = e[n]))
      return r
    }
    var O = {},
      I
    try {
      var T = ((I = !1),
      (0, d.safeObjectHasProp)(window, 'apstag') &&
        (0, d.safeObjectHasProp)(window.apstag, 'debug') &&
        ((I = !0),
        (0, p.reportError)(
          new Error('apstag has already loaded - preventing duplicate load'),
          '__error-apstag_duplicate_load__',
          !0
        )),
      I)
      T ||
        (function() {
          var e = (0, l.getWindowPerformanceMetric)(window, 'navigationStart'),
            t = (0, d.getRand)(),
            r = (0, d.isDebugEnabled)('console')
          function a() {
            try {
              return window.top !== window.self
                ? encodeURIComponent(document.referrer)
                : ''
            } catch (e) {
              return (
                (0, p.reportError)(e, '__error-detectIframeAndGetURL__'),
                encodeURIComponent(document.documentURI)
              )
            }
          }
          function h() {
            var e, t
            try {
              try {
                t = window.top.document.referrer
              } catch (e) {
                ;(0, p.reportError)(e, '__error-getPageReferrerURL-1__'),
                  (t = window.document.referrer)
              }
              e = encodeURIComponent(t)
            } catch (e) {
              ;(0, p.reportError)(e, '__error-getPageReferrerURL-2__')
            }
            return e
          }
          function I() {
            var e = (0, d.getDebugValue)('url')
            if ('' !== e) return encodeURIComponent(e)
            var t = encodeURIComponent(document.documentURI)
            try {
              ;((t = encodeURIComponent(window.top.location.href)) &&
                void 0 !== t) ||
                (t = a())
            } catch (e) {
              ;(0, p.reportError)(e, '__error-getReferrerURL__'), (t = a())
            }
            return t
          }
          function T() {
            if (!(0, d.hasLocalStorage)())
              return u.NO_LOCAL_STORAGE_SUPPORT_MAGIC_NUMBER_FOR_AAX
            var e = c.store.getState()
            return (0, d.safeObjectHasProp)(e, 'cfg') &&
              (0, d.safeObjectHasProp)(e.cfg, 'v')
              ? e.cfg.v
              : null
          }
          function D(e) {
            return encodeURIComponent(JSON.stringify(e))
          }
          !(function() {
            if ((0, d.hasLocalStorage)()) {
              var e = localStorage.getItem(u.CFG_LOCAL_STORAGE_KEY)
              if (e && 'undefined' !== e) {
                var t = JSON.parse(e)
                c.store.dispatch({ type: 'SET_CFG', cfg: t })
              }
            }
          })()
          var A = ((w = {}),
            (R = Date.now()),
            (P = 0),
            {
              addTimer: function(e, t) {
                t || (t = Date.now()), (w[e] = t - R)
              },
              set: function(e, t) {
                w[e] = t
              },
              schedule: function(e, t) {
                e || (e = 5e3),
                  t || (t = 'PH'),
                  (t += '/'),
                  setTimeout(function() {
                    var e
                    ;(w.i = P),
                      (w.t0 = R),
                      (w.site = ((e = decodeURIComponent(I())).indexOf('://') >
                      -1
                        ? e.split('/')[2]
                        : e.split('/')[0]
                      ).split(':')[0]),
                      (0, f.noBidCacheIdPixel)(w),
                      (w = {}),
                      (R = Date.now()),
                      P++
                  }, e)
              },
            }),
            w,
            R,
            P,
            C
          function z(e) {
            ;(e.ts = Date.now()),
              c.store.dispatch({ type: 'LOG_EVENT', event: e })
          }
          function L(e) {
            function t(e) {
              if (!c.store.getState().cmpFired) {
                c.store.dispatch({ type: 'CMP_FIRED' })
                var t = document.createElement('iframe')
                ;(t.style.display = 'none'),
                  (t.src = e),
                  document.body.appendChild(t)
              }
            }
            document.readyState && 'loading' === document.readyState
              ? document.addEventListener
                ? document.addEventListener(
                    'DOMContentLoaded',
                    function() {
                      t(e)
                    },
                    !1
                  )
                : document.attachEvent &&
                  document.attachEvent('onreadystatechange', function() {
                    'complete' === document.readyState && t(e)
                  })
              : t(e)
          }
          function j(e) {
            try {
              var t = c.store.getState().cfg.COOKIE_MATCH_DELAY
              window.setTimeout(function() {
                try {
                  e && e.cmp && '' !== e.cmp && void 0 !== e.cmp
                    ? L(e.cmp)
                    : e &&
                      e.cmpjs &&
                      '' !== e.cmpjs &&
                      void 0 !== e.cmpjs &&
                      (0, m.loadScriptTag)(e.cmpjs)
                } catch (e) {
                  ;(0, p.reportError)(e, '__error-tryCookieMatch-1__')
                }
              }, t)
            } catch (e) {
              ;(0, p.reportError)(e, '__error-tryCookieMatch-2__')
            }
          }
          function B(e) {
            if (!e) return !1
            try {
              var t = Math.floor(Number(e))
              if (t > u.MINIMUM_BID_TIMEOUT) return t
            } catch (e) {
              return (
                (0, p.reportError)(e, '__error-getValidMilliseconds__', !0), !1
              )
            }
            return !1
          }
          function x(e) {
            return (
              !c.store.getState().experiments.chunkRequests ||
              0 ===
                c.store
                  .getState()
                  .bidReqs[e.split('-')[0]].networkReqs.filter(function(e) {
                    return e.inFlight
                  }).length
            )
          }
          function M(e, t) {
            !c.store.getState().bidReqs[e[0]].hasCallbackExecuted &&
              x(e[0]) &&
              (c.store.dispatch({ type: 'RECORD_CALLBACK', fid: e[0] }), t())
          }
          function N(e) {
            c.store.getState().experiments.chunkRequests &&
              c.store.dispatch({
                type: 'RECORD_NETWORK_EXCHANGE',
                fid: e[0],
                timestamp: Date.now(),
                exchangeType: 'response',
                networkID: e[1],
              })
          }
          function H(e, t, r) {
            var n = r.split('-'),
              o = { url: e, withCredentials: !0 }
            try {
              ;(o.onload = function(e) {
                N(n), eval(e.responseText), M(n, t)
              }),
                (o.onerror = function() {
                  N(n), M(n, t)
                }),
                (0, m.xhrGet)(o)
            } catch (e) {
              ;(0, p.reportError)(e, '__error-xhrBid__'), N(n), M(n, t)
            }
          }
          function k() {
            var e,
              t = {},
              r = document.cookie.split('; ')
            return (
              (t.cookiesParams = ''),
              r.forEach(function(r) {
                if ((e = r.split('='))[0] in u.FIRST_PARTY_COOKIE_KEYS)
                  switch (e[0]) {
                    case 'aps_ext_917':
                      t.fb = e[1]
                      break
                    default:
                      t.cookiesParams +=
                        '&' +
                        u.FIRST_PARTY_COOKIE_KEYS[e[0]].urlParam +
                        '=' +
                        e[1]
                  }
              }),
              t.fb ||
                c.store.getState().sync917 ||
                c.store.dispatch({ type: 'SET_SYNC_917', value: !0 }),
              t
            )
          }
          function U(e) {
            var t = new Date()
            return t.setTime(t.getTime() + 1e3 * e), t.toGMTString()
          }
          function q(e) {
            if (e[u.AAX_RESP_REMAP_COOKIE_KEY])
              try {
                e[u.AAX_RESP_REMAP_COOKIE_KEY].forEach(function(e) {
                  document.cookie =
                    e.k + '=' + e.v + ';expires=' + U(e.exp) + ';'
                })
              } catch (e) {
                ;(0, p.reportError)(e, '__error-setFirstPartyCookies__')
              }
          }
          function G(e) {
            ;(0, d.safeObjectHasProp)(e, 'cb') &&
              (c.store.dispatch({
                type: 'RECORD_AAX_RESPONSE_PROP',
                bidReqID: e.cb,
                key: 'resTs',
                value: Date.now(),
              }),
              c.store.dispatch({
                type: 'RECORD_AAX_RESPONSE_PROP',
                bidReqID: e.cb,
                key: 'perf',
                value: (0, l.getResourcePerformanceObject)(window, e.cb),
              })),
              (0, d.safeObjectHasProp)(e, 'cfg') &&
                c.store.dispatch({ type: 'SET_CFG', cfg: e.cfg }),
              A.addTimer('br'),
              A.set('brs', e.punt ? '0' : '1'),
              (0, d.safeObjectHasProp)(e, 'rm') && A.schedule(e.to, e.id),
              He(e)
          }
          function F(e) {
            if (
              (j(e),
              q(e),
              (0, d.safeObjectHasProp)(e, 'cfg') &&
                localStorage.setItem(
                  u.CFG_LOCAL_STORAGE_KEY,
                  JSON.stringify(e.cfg)
                ),
              (0, d.safeObjectHasProp)(e, 'st') &&
                e.st.includes(917) &&
                c.store.getState().sync917)
            ) {
              c.store.dispatch({ type: 'SET_SYNC_917', value: !1 })
              try {
                Ee()
              } catch (e) {
                ;(0, p.reportError)(e, '__error-doFbSync__')
              }
            }
            e.punt || (0, f.sendPixels)()
          }
          function K(e, t) {
            var r = !1,
              n = null,
              o = function(t) {
                if (!r) {
                  try {
                    e(t), n && clearTimeout(n)
                  } catch (e) {
                    ;(0, p.reportError)(e, '__error-wrapCallback__', !0)
                  }
                  r = !0
                }
              }
            return (
              (n = window.setTimeout(
                o.bind(null, !0),
                t || c.store.getState().cfg.DEFAULT_TIMEOUT
              )),
              o.bind(null, !1)
            )
          }
          function X() {
            try {
              return (
                (window.innerWidth ||
                  document.documentElement.clientWidth ||
                  document.body.clientWidth) +
                'x' +
                (window.innerHeight ||
                  document.documentElement.clientHeight ||
                  document.body.clientHeight)
              )
            } catch (e) {
              ;(0, p.reportError)(e, '__error-getWindowsDimensions__')
            }
            return 'x'
          }
          function Q(e) {
            if ('string' == typeof e && e.length > 0) return !0
            if (Array.isArray(e)) {
              for (var t = 0; t < e.length; t++) {
                if ('string' != typeof e[t]) return !1
                if (0 === e[t].length) return !1
              }
              return !0
            }
            return !1
          }
          function Y(e) {
            return D(
              e
                .map(function(e) {
                  var t = {}
                  return (
                    (0, d.safeObjectHasProp)(e, 'mediaType') &&
                    'video' === e.mediaType
                      ? ((t.id = e.slotID),
                        (t.mt = u.MEDIA_TYPES_MAGIC_STRING_FOR_AAX.video))
                      : (0, d.safeObjectHasProp)(e, 'sizes') &&
                        ((t.sd = e.slotID),
                        (t.s = e.sizes.filter(d.isArray).map(function(e) {
                          return e.join('x')
                        })),
                        (0, d.safeObjectHasProp)(e, 'slotName') &&
                          e.slotName !== e.slotID &&
                          (t.sn = e.slotName)),
                    (0, d.safeObjectHasProp)(e, 'slotParams') &&
                      'object' === o(e.slotParams) &&
                      null !== e.slotParams &&
                      ((t.kv = {}),
                      Object.keys(e.slotParams).forEach(function(r) {
                        Q(e.slotParams[r]) && (t.kv[r] = e.slotParams[r])
                      })),
                    0 !== Object.keys(t).length ? t : n({}, e, { id: 'error' })
                  )
                })
                .filter(function(e) {
                  return 'error' !== e.id
                })
            )
          }
          function V(e) {
            var t,
              r =
                e.blockedBidders && (0, d.isArray)(e.blockedBidders)
                  ? e.blockedBidders
                  : c.store.getState().config.blockedBidders
            return r && (0, d.isArray)(r) && (t = JSON.stringify(r)), t
          }
          function W(e, r) {
            var a,
              i,
              l =
                (0, d.getDebugValue)('host') ||
                c.store.getState().hosts.DEFAULT_AAX_BID_HOST,
              f = c.store.getState().cfg.DTB_PATH,
              p = c.store.getState().config.pubID,
              g = t,
              m = I(),
              _ = h(),
              b = X(),
              S = u.LIBRARY_VERSION,
              E = k(),
              v = V(e),
              y = T(),
              O = {}
            if (
              (c.store.dispatch({
                type: 'RECORD_AAX_REQUEST',
                data: {
                  bidConfig: e,
                  timeout: r,
                  bidReqID: e.bidReqID,
                  ws: b,
                  url: m,
                  rqTs: Date.now(),
                },
              }),
              c.store.getState().experiments.chunkRequests)
            ) {
              var A = e.bidReqID.split('-')
              c.store.dispatch({
                type: 'RECORD_NETWORK_EXCHANGE',
                fid: A[0],
                networkID: A[1],
                timestamp: Date.now(),
                exchangeType: 'request',
              })
            }
            ;(a = c.store.getState().config.isSelfServePub
              ? 'src=600&pubid=' + p
              : 'src=' + p),
              (a +=
                '&u=' +
                m +
                '&pid=' +
                g +
                '&cb=' +
                e.bidReqID +
                '&ws=' +
                b +
                '&v=' +
                S +
                '&t=' +
                r),
              (0, d.safeObjectHasProp)(e, 'slots') &&
                (a += '&slots=' + Y(e.slots))
            var w = c.store.getState().config.params,
              R = e.params,
              P = c.store.getState().experiments
            ;(w = (0, d.isObject)(w) ? w : {}),
              (R = (0, d.isObject)(R) ? R : {}),
              (i = n({}, w, R, { apse: P })),
              (a += '&pj=' + D(i)),
              E.cookiesParams && (a += E.cookiesParams),
              E.fb &&
                ((O[917] = E.fb),
                (a +=
                  '&' +
                  u.FIRST_PARTY_COOKIE_KEYS.aps_ext_917.urlParam +
                  '=' +
                  encodeURIComponent(JSON.stringify(O)))),
              (y || y === u.NO_LOCAL_STORAGE_SUPPORT_MAGIC_NUMBER_FOR_AAX) &&
                (a += '&cfgv=' + y)
            var C,
              z,
              L = (0, d.getDebugValue)('bidParams')
            return (
              '' !== L &&
                Object.keys(L).forEach(function(e) {
                  a += '&' + e + '=' + L[e]
                }),
              _ && '' !== _ && (a += '&pr=' + _),
              v && (a += '&bb=' + v),
              'object' === o(c.store.getState().gdpr) &&
                null !== c.store.getState().gdpr &&
                ((C = n({}, c.store.getState().gdpr)),
                (z = { enabled: 'gdpre', consent: 'gdprc', log: 'gdprl' }),
                Object.keys(z)
                  .filter(function(e) {
                    return void 0 !== C[e]
                  })
                  .map(function(e) {
                    switch (e) {
                      case 'log':
                        if ((0, d.hasLocalStorage)()) {
                          var t = window.localStorage.getItem(s.cmpResponseKey)
                          if (null !== t) {
                            try {
                              t = JSON.parse(t)
                            } catch (e) {
                              t = null
                            }
                            window.localStorage.removeItem(s.cmpResponseKey)
                          }
                          null !== t &&
                            (C.log = JSON.stringify(
                              n({}, JSON.parse(C.log), { rtimes: t })
                            ))
                          var r = window.localStorage.getItem(
                            s.cmpLocalStorageChanged
                          )
                          null !== r &&
                            (window.localStorage.removeItem(
                              s.cmpLocalStorageChanged
                            ),
                            (C.log = JSON.stringify(
                              n({}, JSON.parse(C.log), { cc: r })
                            )))
                        }
                    }
                    a += '&' + z[e] + '=' + encodeURIComponent(C[e])
                  })),
              '' + u.PROTOCOL + l + f + '/bid?' + a
            )
          }
          function J() {
            c.store.getState().Q.forEach(function(e) {
              'i' === e[0]
                ? window.apstag.init.apply(null, e[1])
                : window.apstag.fetchBids.apply(null, e[1])
            })
          }
          function Z(e) {
            return (
              c.store.dispatch({ type: 'SET_GDPR_CONFIG', config: null }),
              c.store.dispatch({
                type: 'SET_CONFIG',
                config: e,
                defaultCmpTimeout: c.store.getState().cfg.GDPR_CMP_TIMEOUT,
              }),
              'success'
            )
          }
          function $() {
            var e = c.store.getState()
            return (
              ((0, d.safeObjectHasProp)(e, 'config') &&
                (0, d.safeObjectHasProp)(e.config, 'deals') &&
                !0 === e.config.deals) ||
              O.needNewBidObject
            )
          }
          function ee(e) {
            var t = e.slotID
            ;((0, d.safeObjectHasProp)(e, 'mediaType') &&
              'video' === e.mediaType) ||
              (O.hasAdServerObjectLoaded() &&
                O.isCommandQueueDefined() &&
                (O.hasAdServerObjectLoaded()
                  ? te(t) && me(e)
                  : O.cmdQueuePush(function() {
                      ee(e)
                    })))
          }
          function te(e) {
            var t
            try {
              t = ce().filter(function(t) {
                return O.getSlotElementId(t) === e
              })[0]
            } catch (e) {
              ;(0, p.reportError)(e, '__error-getAdServerSlot__')
            }
            return t
          }
          function re(e) {
            return (0, d.safeObjectHasProp)(e, 'amzniid')
              ? e.amzniid
              : e.amzniid_sp
          }
          function ne(e) {
            try {
              var t = c.store.getState().targetingKeys[e]
              if (O.hasAdServerObjectLoaded() && (0, d.isArray)(t)) {
                var r = te(e)
                t.forEach(function(e) {
                  O.getTargeting(e, r).length > 0 && O.clearTargeting(e, r)
                })
              }
            } catch (e) {
              ;(0, p.reportError)(e, '__error-clearTargetingFromSlot__')
            }
          }
          function oe(e) {
            var t
            try {
              var r = c.store.getState().slotBids
              ;(0, d.safeObjectHasProp)(r, e) &&
                r[e].forEach(function(e) {
                  e.bidState === u.BID_STATES.set && (t = re(e))
                })
            } catch (e) {
              ;(0, p.reportError)(e, '__error-findBidIDSetBySlotID__')
            }
            return t
          }
          function ae(e) {
            try {
              if ((0, d.safeObjectHasProp)(c.store.getState().slotBids, e)) {
                var t = c.store.getState().slotBids[e].filter(function(e) {
                  return e.bidState === u.BID_STATES.set
                })[0]
                t &&
                  t.bidState === u.BID_STATES.set &&
                  c.store.dispatch({
                    type: 'BID_STATE_CHANGE',
                    slotID: e,
                    bidID: oe(e),
                    bidState: u.BID_STATES.exposed,
                  })
              }
            } catch (e) {
              ;(0, p.reportError)(e, '__error-clearbidSetOnSlot__')
            }
          }
          function ie(e, t) {
            return (
              decodeURIComponent(e)
                .split('?')[0]
                .split('#')[0] ===
              decodeURIComponent(t)
                .split('?')[0]
                .split('#')[0]
            )
          }
          function se(e, t) {
            return (
              e
                .map(function(e) {
                  return (0, d.inArray)(t, e)
                })
                .filter(function(e) {
                  return e
                }).length === e.length
            )
          }
          function ce() {
            var e = []
            try {
              O.hasAdServerObjectLoaded() && (e = O.getSlots())
            } catch (e) {
              ;(0, p.reportError)(e, '__error-getAdServerSlots__')
            }
            return e
          }
          function de() {
            var e = {}
            try {
              Object.keys(c.store.getState().slotBids).forEach(function(t) {
                if (
                  -1 ===
                  c.store.getState().displayAdServer.noBidSlotIDs.indexOf(t)
                ) {
                  var r = c.store
                    .getState()
                    .slotBids[t].filter(function(e) {
                      return (
                        Date.now() -
                          c.store.getState().AAXReqs.filter(function(t) {
                            return t.bidReqID === e.bidReqID
                          })[0].rqTs <
                        24e4
                      )
                    })
                    .filter(function(e) {
                      return ie(
                        I(),
                        c.store.getState().AAXReqs.filter(function(t) {
                          return t.bidReqID === e.bidReqID
                        })[0].url
                      )
                    })
                    .filter(function(e) {
                      return e.bidState !== u.BID_STATES.rendered
                    })
                  r.length > 0 &&
                    (e[t] = r
                      .map(function(e) {
                        var t = c.store.getState().AAXReqs.filter(function(t) {
                          return t.bidReqID === e.bidReqID
                        })[0].rqTs
                        return n({}, e, { rqTs: t })
                      })
                      .reduce(function(e, t) {
                        return e.rqTs > t.rqTs ? e : t
                      }))
                }
              })
            } catch (e) {
              ;(0, p.reportError)(e, '__error-getCurrentSlotBids__')
            }
            return e
          }
          function ue(e, t) {
            return (0, d.isArray)(c.store.getState().targetingKeys[e])
              ? t
                ? ['amzniid_sp']
                : c.store.getState().targetingKeys[e].filter(function(e) {
                    return (
                      e.indexOf('amzniid') > -1 && e.indexOf('amzniid_sp') < 0
                    )
                  })
              : ['amzniid']
          }
          function le(e, t) {
            var r, n
            try {
              var o = c.store.getState().slotBids
              Object.keys(o).forEach(function(a) {
                o[a].forEach(function(o) {
                  ue(a, t).forEach(function(t) {
                    o[t] === e &&
                      ((r = o),
                      'amzniid_sp' === t
                        ? (n = 'sp')
                        : 'amzniid' !== t &&
                          (n = t.substr(0, t.indexOf('amzniid'))))
                  })
                })
              })
            } catch (e) {
              ;(0, p.reportError)(e, '__error-findSlotBidByBidID__')
            }
            return { slotBid: r, dealId: n }
          }
          function fe(e, t, r) {
            var n
            return (
              t[r + 'amzniid'] === e &&
                (n = r
                  .split('_')
                  .pop()
                  .trim()),
              n
            )
          }
          function pe(e) {
            var t = {}
            return (
              e.slots.forEach(function(e) {
                'video' !== e.mediaType
                  ? (t[e.slotID] = e)
                  : (e.slotID.indexOf('rsv-') >= 0 &&
                      (e = {
                        slotID: e.slotID.substring(4),
                        r_amznbid: e.amznbid,
                        r_amzniid: e.amzniid,
                        r_amznp: e.amznp,
                        mediaType: 'video',
                        targeting: ['r_amznbid', 'r_amzniid', 'r_amznp'],
                      }),
                    t[e.slotID]
                      ? ((e.targeting = e.targeting.concat(
                          t[e.slotID].targeting
                        )),
                        (t[e.slotID] = n({}, t[e.slotID], e)))
                      : (t[e.slotID] = e))
              }),
              Object.keys(t).map(function(e) {
                return t[e]
              })
            )
          }
          function ge(e) {
            var t,
              r = pe(e),
              o = ['host', 'ev', 'cb', 'cmp', 'cfe']
            try {
              t = r.map(function(t) {
                var r = { bidState: u.BID_STATES.new }
                return (
                  (0, d.safeObjectHasProp)(t, 'amznsz') || (r.amznsz = t.size),
                  o.forEach(function(t) {
                    if ((0, d.safeObjectHasProp)(e, t)) {
                      var n = e[t],
                        o = t
                      'cb' === t && (o = 'bidReqID'), (r[o] = n)
                    }
                  }),
                  n({}, t, r)
                )
              })
            } catch (e) {
              ;(0, p.reportError)(e, '__error-convertAAXResponse__')
            }
            return t
          }
          function me(e) {
            try {
              var t,
                r = e.slotID,
                n = re(e),
                o = e.targeting ? e.targeting : xt('display')
              if ((t = te(r))) {
                if (oe(r) === n) return
                ae(r),
                  Object.keys(e)
                    .filter(function(e) {
                      return (0, d.inArray)(o, e)
                    })
                    .forEach(function(r) {
                      return O.setTargeting(r, e[r], t)
                    }),
                  c.store.dispatch({
                    type: 'BID_STATE_CHANGE',
                    slotID: r,
                    bidID: n,
                    bidState: u.BID_STATES.set,
                    ts: Date.now(),
                  })
              }
            } catch (e) {
              ;(0, p.reportError)(e, '__error-applyTargetingToAdServerSlot__')
            }
          }
          function _e(e) {
            var t = de()
            e.forEach(function(e) {
              t[e] && ee(t[e])
            })
          }
          function be() {
            var e = de()
            Object.keys(e).forEach(function(t) {
              ee(e[t])
            })
          }
          function Se(e) {
            try {
              e ? _e(e) : be(),
                c.store.getState().displayAdServer.slotRenderEndedSet ||
                  (O.cmdQueuePush(function() {
                    O.slotRenderEndedEvent(function(e) {
                      ne(O.getSlotElementId(e.slot)),
                        ae(O.getSlotElementId(e.slot))
                    })
                  }),
                  c.store.dispatch({ type: 'SLOT_RENDER_ENDED_SET' }))
            } catch (e) {
              ;(0, p.reportError)(e, '__error-applySlotTargeting__')
            }
          }
          function Ee() {
            var e = 197,
              t =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
              r = '1881141382166183',
              n = 'https://www.facebook.com/audiencenetwork/token/update'
            function o(e) {
              var t = JSON.parse(e),
                r = t.fbToken,
                n = new Date(parseInt(t.expAfter, 10)).toUTCString()
              document.cookie = 'aps_ext_917=' + r + '; expires=' + n
            }
            function a(r) {
              !(function(e, t, r) {
                var o
                !(function(e, t) {
                  var r = { url: e, withCredentials: !0 }
                  try {
                    ;(r.onload = function(e) {
                      t(e.responseText)
                    }),
                      (r.onerror = function() {}),
                      (0, m.xhrGet)(r)
                  } catch (e) {
                    ;(0, p.reportError)(e, '__error-fbTokenRequest__')
                  }
                })(
                  ((o = t),
                  n +
                    '?partner=' +
                    encodeURIComponent(e) +
                    '&vr_token=' +
                    encodeURIComponent(o)),
                  r
                )
              })(
                r,
                (function() {
                  for (var r = 'VR_', n = 0; n < e; ++n)
                    r += t.charAt(Math.floor(Math.random() * t.length))
                  return r
                })(),
                o
              )
            }
            'complete' === document.readyState
              ? a(r)
              : window.addEventListener('load', function() {
                  a(r)
                })
          }
          function he(e, t) {
            var r = !1,
              n = 0,
              o = function o() {
                if (!r)
                  if (n++ >= 20)
                    (0, p.reportError)(
                      {
                        name: 'LoopError',
                        message: 'Too many attempts to append to document.body',
                      },
                      '__error-safeDocumentBodyAppendChild-loops__',
                      !0
                    )
                  else {
                    try {
                      if (
                        e &&
                        e.body &&
                        null !== e.body &&
                        'function' == typeof e.body.appendChild
                      )
                        return e.body.appendChild(t), void (r = !0)
                    } catch (e) {
                      ;(0, p.reportError)(
                        e,
                        '__error-safeDocumentBodyAppendChild-callback__'
                      )
                    }
                    setTimeout(o, 100)
                  }
              }
            try {
              'complete' === e.readyState || 'interactive' === e.readyState
                ? o()
                : e.addEventListener
                ? e.addEventListener('DOMContentLoaded', o)
                : e.attachEvent('onreadystatechange', function() {
                    ;('complete' !== e.readyState &&
                      'interactive' !== e.readyState) ||
                      o()
                  })
            } catch (e) {
              ;(0, p.reportError)(
                e,
                '__error-safeDocumentBodyAppendChild-outer__'
              )
            }
          }
          function ve(e) {
            var t, r
            return (
              (t = '' + e.host + c.store.getState().cfg.DTB_PATH + '/imp'),
              (r = '' + e.host + c.store.getState().cfg.DTB_PATH + '/adm'),
              e.cfe || e.isAmp ? r : t
            )
          }
          function ye(e) {
            var t,
              r = '?b=' + e.bidID + '&rnd=' + (0, d.getRand)()
            return (
              (0, d.safeObjectHasProp)(e, 'pp') && (r += '&pp=' + e.pp),
              (0, d.safeObjectHasProp)(e, 'amznp') && (r += '&p=' + e.amznp),
              (0, d.safeObjectHasProp)(e, 'crID') && (r += '&crid=' + e.crID),
              (0, d.safeObjectHasProp)(e, 'isSharedPMP') &&
                !0 === e.isSharedPMP &&
                (r += '&sp=true'),
              (t = ve(e)),
              '1' === e.fif ? t + 'j' + r : t + 'i' + r
            )
          }
          function Oe(e) {
            var t = e.doc.createElement('iframe')
            return (
              (t.frameBorder = 0),
              (t.marginHeight = 0),
              (t.marginWidth = 0),
              (t.topMargin = 0),
              (t.leftMargin = 0),
              (t.scrolling = 'no'),
              (t.allowTransparency = !0),
              (t.width = e.sizes[0] + 'px'),
              (t.height = e.sizes[1] + 'px'),
              t
            )
          }
          function Ie(e) {
            var t
            try {
              if ((0, d.safeObjectHasProp)(e, 'bidType'))
                switch (e.bidType) {
                  case 'sharedPMP':
                    var r = e.kvMap
                    t = {
                      bidID: r.amzniid_sp[0],
                      pp: r.amznbid_sp[0],
                      sizes: r.amznsz_sp[0].split('x'),
                      amznp: r.amznp_sp[0],
                      isSharedPMP: e.isSharedPMP,
                    }
                    break
                  case 'preferredPMP':
                    var n = e.kvMap,
                      o = e.amzndeal
                        .split('_')
                        .pop()
                        .trim()
                    t = { bidID: n[e.amzndeal + 'amzniid'][0], sizes: St(o) }
                    break
                  case 'openAuction':
                    if ((0, d.safeObjectHasProp)(e, 'kvMap')) {
                      var a = e.kvMap
                      t = {
                        bidID: a.amzniid[0],
                        pp: (0, d.getAmpAmznBidValue)(a.amznbid[0]),
                        amznp: a.amznp[0],
                        sizes: a.amznsz[0].split('x'),
                      }
                    } else
                      t = {
                        bidID: e.amzniid,
                        pp: (0, d.getAmpAmznBidValue)(e.amznbid),
                        amznp: e.amznp,
                        sizes: e.amznsz.split('x'),
                      }
                    break
                  default:
                    try {
                      ;(0, p.reportError)(
                        {
                          name: 'Invalid AMP Bid Type: ' + e.bidType,
                          message: 'No valid AMP bid type',
                        },
                        '__error-ampBidAuctionTypeSelectionDefaultBlock__'
                      )
                    } catch (e) {
                      ;(0, p.reportError)(
                        e,
                        '__error-ampBidAuctionSwitchStatement__'
                      )
                    }
                }
            } catch (e) {
              ;(0, p.reportError)(e, '__error-getAmpAdData__')
            }
            return t
          }
          function Te(e, t) {
            try {
              var r = {},
                n = {}
              ;(0, d.safeObjectHasProp)(t, 'ampEnv') &&
                t.ampEnv &&
                ((r = t),
                (0, d.safeObjectHasProp)(t, 'bidType') &&
                'sharedPMP' === t.bidType
                  ? (r.isSharedPMP = !0)
                  : (r.isSharedPMP = !1),
                (r.document = e)),
                _t(e) && (((r = e).bidType = 'openAuction'), (r.ampEnv = !0)),
                (0, d.safeObjectHasProp)(r, 'kvMap') &&
                  (r.amznhost = t.kvMap.amznhost[0]),
                ((n = Ie(r)).doc = r.document),
                (n.host = r.amznhost.replace('http://', 'https://')),
                (n.adID = 'amznad' + (0, d.getRand)()),
                (n.isAmp = r.ampEnv),
                Ae(n)
            } catch (e) {
              ;(0, p.reportError)(e, '__error-renderAmpImpression__')
            }
          }
          function De(e) {
            try {
              var t = Oe(e)
              ;(t.id = 'apstag-f-iframe-' + (0, d.getRand)()),
                (t.src = 'about:blank'),
                he(e.doc, t)
              var r = e.html
              t.contentWindow.document.open(),
                t.contentWindow.document.write(r),
                t.contentWindow.document.close()
            } catch (e) {
              ;(0, p.reportError)(e, '__error-loadAdIntoFriendlyIframe__')
            }
          }
          function Ae(e, t) {
            try {
              var r = Oe(e),
                n = {}
              if (
                ((r.id = e.adID),
                (r.sandbox =
                  'allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation'),
                (0, d.isDebugEnabled)('fake_bids'))
              ) {
                var o =
                  '<body style="background-color: #FF9900;">' +
                  (e.sizes[1] > 50 ? '<h3>apstag Test Creative</h3>' : '') +
                  '<h4>amzniid - ' +
                  e.bidID +
                  ' | amznbid: ' +
                  e.pp +
                  ' | size: ' +
                  e.sizes.join('x') +
                  '</h4></body>'
                r.src = "javascript:'" + o + "'"
              } else r.src = ye(e)
              e.isAmp
                ? ((n.doc = e.doc), (n.amzniid = e.bidID), (n.slotID = 'amp'))
                : ((n = le(e.bidID, e.isSharedPMP).slotBid).doc = e.doc),
                he(e.doc, r),
                (e.viewabilityParams = e.viewabilityParams || { states: {} }),
                (e.viewabilityParams.iframe = r),
                (r.onload = function() {
                  ;(e.viewabilityParams.states.iframeLoaded = !0), t && t()
                })
            } catch (e) {
              ;(0, p.reportError)(e, '__error-loadAdIntoUnfriendlyIframe__')
            }
          }
          function we(e) {
            var t,
              r = e.states,
              n = e.doc,
              o = e.bidID,
              a = e.iframe
            ut(r) ||
              ((r.shouldRunViewability = !1),
              (0, d.safeObjectHasProp)(window, 'amzncsm')
                ? (t = window.amzncsm)
                : (0, d.safeObjectHasProp)(n.defaultView, 'amzncsm') &&
                  (t = n.defaultView.amzncsm),
              t &&
                (0, d.safeObjectHasProp)(t, 'rmD') &&
                ((t.host = c.store.getState().hosts.DEFAULT_AAX_PIXEL_HOST),
                t.rmD(a, o, n.defaultView, n, c.store.getState().config.pubID)))
          }
          function Re(e) {
            var t = e.map(Ne),
              r = {}
            return (
              Object.keys(c.store.getState().slotBids).forEach(function(e) {
                var n = c.store.getState().slotBids[e].filter(function(e) {
                  return e.bidState === u.BID_STATES.new
                })[0]
                n &&
                  (0, d.inArray)(t, e) &&
                  ((r[e] = n),
                  c.store.dispatch({
                    type: 'BID_STATE_CHANGE',
                    slotID: e,
                    bidID: re(n),
                    bidState: u.BID_STATES.exposed,
                  }))
              }),
              r
            )
          }
          function Pe(e, t) {
            var r = '0x0'
            return $()
              ? {
                  slotID: e,
                  size: r,
                  mediaType: 'banner',
                  targeting: { amznbid: t, amzniid: '', amznp: t, amznsz: r },
                  helpers: {
                    targetingKeys: ['amznbid', 'amzniid', 'amznp', 'amznsz'],
                  },
                }
              : {
                  slotID: e,
                  amzniid: '',
                  amznbid: t,
                  amznp: t,
                  amznsz: r,
                  size: r,
                }
          }
          function Ce(e, t) {
            var r = ''
            return (
              e.targeting.forEach(function(t) {
                r += '&' + t + '=' + e[t]
              }),
              !0 === t && (r = encodeURIComponent(r)),
              r
            )
          }
          function ze(e, t, r) {
            var n,
              o = t.slots.filter(ft).map(Ne),
              a = e.map(Ne)
            return (
              (n = r
                ? o.map(function(e) {
                    return Pe(e, u.SLOT_STATES.bidInFlight)
                  })
                : o.reduce(function(e, t) {
                    return (
                      (0, d.inArray)(a, t) ||
                        e.push(Pe(t, u.SLOT_STATES.noBid)),
                      e
                    )
                  }, [])),
              e.concat(n)
            )
          }
          function Le(e, t) {
            return function(r) {
              var n = Re(t.slots),
                o = Object.keys(n),
                a = []
              r &&
                (c.store.dispatch({
                  type: 'RECORD_AAX_RESPONSE_PROP',
                  bidReqID: t.bidReqID,
                  key: 'timedOutAt',
                  value: Date.now(),
                }),
                c.store.getState().experiments.chunkRequests &&
                  c.store.dispatch({
                    type: 'RECORD_TIMEOUT',
                    fid: t.bidReqID,
                    timeOut: Date.now(),
                  })),
                o.forEach(function(e) {
                  if ((0, d.safeObjectHasProp)(n, e)) {
                    var t = n[e],
                      r = {}
                    if ($())
                      t.meta.forEach(function(e) {
                        r[e] = t[e]
                      }),
                        (r.targeting = {}),
                        t.targeting.forEach(function(e) {
                          r.targeting[e] = t[e]
                        }),
                        (r.helpers = {
                          targetingKeys: t.targeting,
                          qsParams: Ce.bind(null, t, !1),
                          encodedQsParams: Ce.bind(null, t, !0),
                        })
                    else if ((0, d.safeObjectHasProp)(t, 'amznbid')) {
                      if (
                        ((0, d.safeObjectHasProp)(t, 'amznp') || (t.amznp = ''),
                        (r = {
                          amzniid: t.amzniid,
                          amznbid: t.amznbid,
                          amznp: t.amznp,
                          slotID: e,
                        }),
                        (0, d.safeObjectHasProp)(t, 'size') &&
                          ((r.size = t.size), (r.amznsz = t.amznsz)),
                        'video' === t.mediaType)
                      ) {
                        r.mediaType = 'video'
                        var o = ''
                        t.amznbid
                          ? (o +=
                              '&amzniid=' +
                              t.amzniid +
                              '&amznbid=' +
                              t.amznbid +
                              '&amznp=' +
                              t.amznp)
                          : ((r.amznbid = ''), (r.amzniid = '')),
                          t.r_amznbid
                            ? ((r.r_amznbid = t.r_amznbid),
                              (r.r_amzniid = t.r_amzniid),
                              (r.r_amznp = t.r_amznp),
                              (o +=
                                '&r_amzniid=' +
                                t.r_amzniid +
                                '&r_amznbid=' +
                                t.r_amznbid +
                                '&r_amznp=' +
                                t.r_amznp))
                            : ((r.r_amznbid = ''),
                              (r.r_amzniid = ''),
                              (r.r_amznp = '')),
                          (r.qsParams = o),
                          (r.encodedQsParams = encodeURIComponent(o))
                      }
                    } else r = Pe(t.slotID, u.SLOT_STATES.noBid)
                    a.push(r)
                  }
                }),
                O.isSupported && (a = ze(a, t, r)),
                O.appendTargeting(a),
                e(a, { fromTimeout: r })
            }
          }
          function je(e, t) {
            try {
              var r
              ;((r =
                e.defaultView && e.defaultView.frameElement
                  ? e.defaultView.frameElement
                  : window.frameElement).width = t[0]),
                (r.height = t[1])
            } catch (e) {
              ;(0, p.reportError)(e, '__error-resizeIframe__')
            }
          }
          function Be(e) {
            return e[0] + 'x' + e[1]
          }
          function xe(e) {
            return 1 === e.length
              ? Be(e[0])
              : Be(e[Math.floor(e.length * Math.random())])
          }
          function Me(e, t) {
            var r,
              n = c.store.getState().hosts.DEFAULT_AAX_BID_HOST,
              o = I(),
              a = e.bidReqID,
              i = X(),
              s = (0, d.getDebugValue)('testBidTimeout') || 200
            c.store.dispatch({
              type: 'RECORD_AAX_REQUEST',
              data: {
                bidConfig: e,
                timeout: s,
                bidReqID: a,
                ws: i,
                url: o,
                rqTs: Date.now(),
              },
            }),
              (r = e.slots.map(function(e) {
                var t = {
                  slotID: e.slotID,
                  amzniid: u.MOCKBID.amzniid + '-' + (0, d.getRand)(),
                  amznbid: u.MOCKBID.amznbid,
                  amznp: u.MOCKBID.amznp,
                  crid: u.MOCKBID.crid + '-' + (0, d.getRand)(),
                }
                if ((0, d.safeObjectHasProp)(e, 'sizes')) {
                  var r = xe(e.sizes)
                  ;(t.size = r), (t.amznsz = r)
                } else 'video' === e.mediaType && ((t.mediaType = 'video'), (t.amznbid = 'v_' + t.amznbid))
                if ($()) {
                  ;(t.mediaType = 'banner'),
                    (t.meta = ['slotID', 'mediaType', 'size']),
                    (t.amznbid_sp = u.MOCKBID.amznbid + 'SP'),
                    (t.amznp_sp = u.MOCKBID.amznp + 'SP'),
                    (t.amznsz_sp = t.size)
                  var n = 'testDeal' + (0, d.getRand)() + '_' + t.size,
                    o = 'testDealImpression-' + (0, d.getRand)()
                  ;(t.amzndeal_sp = n),
                    (t.amzndeals = [n]),
                    (t[n + 'amzniid'] = o),
                    (t.amzniid_sp = o),
                    (t.targeting = [
                      'amzniid',
                      'amznbid',
                      'amznp',
                      'amznsz',
                      'amzniid_sp',
                      'amznbid_sp',
                      'amznp_sp',
                      'amznsz_sp',
                      'amzndeal_sp',
                      'amzndeals',
                      n + 'amzniid',
                    ])
                }
                return t
              })),
              window.setTimeout(function() {
                window.apstag.bids({ slots: r, host: n, status: 'ok', cb: a }),
                  t(!0)
              }, s)
          }
          function Ne(e) {
            return e.slotID
          }
          function He(e) {
            var t = c.store.getState().AAXReqs.filter(function(t) {
              return t.bidReqID === e.cb
            })[0]
            if (t && t.bidConfig && t.bidConfig.slots) {
              var r = t.bidConfig.slots.filter(ft).map(function(e) {
                  return e.slotID
                }),
                n = (0, d.safeObjectHasProp)(e, 'slots')
                  ? e.slots.map(function(e) {
                      return e.slotID
                    })
                  : [],
                o = r.filter(function(e) {
                  return !(0, d.inArray)(n, e)
                })
              c.store.dispatch({
                type: 'NO_BID_ON_ADSERVER_SLOTS',
                slotIDs: o,
              }),
                O.hasAdServerObjectLoaded()
                  ? qe()
                  : O.isCommandQueueDefined() &&
                    O.cmdQueuePush(function() {
                      qe()
                    })
            }
          }
          function ke(e) {
            return (0, d.inArray)(
              c.store
                .getState()
                .AAXReqs.filter(function(e) {
                  return !e.resTs
                })
                .map(function(e) {
                  return e.bidConfig.slots
                })
                .reduce(function(e, t) {
                  return e.concat(t)
                }, [])
                .map(Ne),
              e
            )
          }
          function Ue(e) {
            var t = O.getTargeting('amznbid', e)
            return t.length > 0 && t[0].length > 2
          }
          function qe() {
            O.hasAdServerObjectLoaded() &&
              '1' === O.getTargeting('amznbid')[0] &&
              Fe(),
              ce().forEach(function(e) {
                !(0, d.inArray)(
                  c.store.getState().displayAdServer.noBidSlotIDs,
                  O.getSlotElementId(e)
                ) ||
                  ke(O.getSlotElementId(e)) ||
                  Ue(e) ||
                  '2' === O.getTargeting('amznbid', e)[0] ||
                  Ge('noBid', e)
              })
          }
          function Ge(e, t) {
            u.SLOT_STATE_KEYS.forEach(function(r) {
              return O.setTargeting(r, u.SLOT_STATES[e], t)
            })
          }
          function Fe() {
            u.SLOT_STATE_KEYS.forEach(function(e) {
              return O.clearTargeting(e)
            })
          }
          function Ke(e) {
            var t = { _type: 'dupePixel', dd: Date.now() - e.renderTime }
            ;(0, f.bidCacheIdPixel)(e.amzniid, t)
          }
          function Xe() {
            var r = (0, l.getResourcePerformanceObject)(
                window,
                'aax2/apstag.js'
              ),
              n = {
                pid: t,
                ns: e,
                fs: (0, l.getMetricFromPerformanceObject)(r, 'fetchStart'),
                re: (0, l.getMetricFromPerformanceObject)(r, 'responseEnd'),
              },
              o = (0, l.isResourceCached)(r)
            null !== o && (n.c = o ? 1 : 0),
              window.setTimeout(f.noBidCacheIdPixel, 1e3, n)
          }
          function Qe() {
            googletag &&
              void 0 !== googletag.cmd &&
              b.displayAdServerGoogletag.cmdQueuePush(function() {
                window.googletag
                  .pubads()
                  .addEventListener('slotRequested', function(e) {
                    try {
                      var t = e.slot
                      c.store.dispatch({
                        type: 'LOG_GAM_EVENT',
                        event: {
                          ts: Date.now(),
                          slotID: b.displayAdServerGoogletag.getSlotElementId(
                            t
                          ),
                          targeting: t.getTargetingMap(),
                        },
                      })
                    } catch (e) {}
                  })
              })
          }
          function Ye() {
            try {
              window.setTimeout(function() {
                var e = Ze().filter(function(e) {
                  return (
                    !(0, d.safeObjectHasProp)(
                      c.store.getState().bsPixels,
                      e.iid
                    ) || e.state !== c.store.getState().bsPixels[e.iid]
                  )
                })
                e &&
                  e.length &&
                  e.length > 0 &&
                  (e.forEach(function(e) {
                    var t = e.iid,
                      r = y(e, ['iid'])
                    ;(0, f.bidCacheIdPixel)(t, We(r))
                  }),
                  Ve(e))
                var r = {
                  fetchStart: 'a',
                  domainLookupStart: 'b',
                  domainLookupEnd: 'c',
                  connectStart: 'd',
                  secureConnectionStart: 'e',
                  connectEnd: 'f',
                  requestStart: 'g',
                  responseStart: 'h',
                  responseEnd: 'i',
                  resTs: 'j',
                }
                Object.keys(c.store.getState().slotBids).forEach(function(e) {
                  c.store
                    .getState()
                    .slotBids[e].filter(function(e) {
                      return void 0 !== e.amzniid
                    })
                    .forEach(function(n) {
                      if (!n.pixelSent) {
                        var a = c.store.getState().AAXReqs.filter(function(e) {
                          return e.bidReqID === n.bidReqID
                        })[0]
                        if (
                          'object' === (void 0 === a ? 'undefined' : o(a)) &&
                          null !== a
                        ) {
                          var i = a.rqTs - (0, l.getTimeOrigin)(),
                            s = {
                              pid: t,
                              lv: u.LIBRARY_VERSION,
                              ns: a.bidConfig.slots.length,
                              fid: n.bidReqID,
                              fbrq: a.rqTs,
                              _type: 'latencyBd',
                            }
                          'object' === o(a.perf) &&
                            null !== a.perf &&
                            Object.keys(r).forEach(function(e) {
                              0 !==
                                (0, l.getMetricFromPerformanceObject)(
                                  a.perf,
                                  e
                                ) &&
                                (s[r[e]] =
                                  (0, l.getMetricFromPerformanceObject)(
                                    a.perf,
                                    e
                                  ) - i)
                            }),
                            (s[r.resTs] = a.resTs - a.rqTs),
                            (0, f.bidCacheIdPixel)(n.amzniid, s),
                            c.store.dispatch({
                              type: 'UPDATE_BID_INFO_PROP',
                              slotID: e,
                              iid: n.amzniid,
                              key: 'pixelSent',
                              value: !0,
                            })
                        }
                      }
                    })
                }),
                  Ye()
              }, 5e3)
            } catch (e) {
              ;(0, p.reportError)(e, '__error-bidSetPixel__')
            }
          }
          function Ve(e) {
            e.forEach(function(e) {
              return c.store.dispatch({
                type: 'RECORD_BID_INFO_SENT',
                bidInfo: e,
              })
            })
          }
          function We(e) {
            var t = {}
            try {
              var r = Je(e.fid)
              ;((t = {
                status: e.state,
                pubid: c.store.getState().config.pubID,
                lv: u.LIBRARY_VERSION,
                _type: 'bidSetPixel',
              }).toa = (0, d.safeObjectHasProp)(r.req, 'timedOutAt')
                ? r.req.timedOutAt
                : '0'),
                (t.fbrq = r.req.rqTs),
                (t.pto = r.req.timeout),
                (t.ns = r.req.bidConfig.slots.length),
                (t.bla = r.req.resTs - r.req.rqTs),
                (t.reqindex = r.index),
                (t.fid = e.fid),
                c.store.getState().cfg.CHUNK_BID_REQUESTS_PROPORTION &&
                  ((t.eid = c.store.getState().experiments.chunkRequests
                    ? 2
                    : 1),
                  (t.fbindex = r.fbIndex),
                  (t.fbns = c.store.getState().bidConfigs[
                    e.fid.split('-')[0]
                  ].slots.length)),
                e.delta && (t.delay = e.delta)
            } catch (e) {
              ;(0, p.reportError)(e, '__error-mapBidInfoToPixel__')
            }
            return t
          }
          function Je(e) {
            var t = {
              req: c.store.getState().AAXReqs.filter(function(t) {
                return t.bidReqID === e
              })[0],
            }
            return (
              (t.index = c.store.getState().AAXReqs.indexOf(t.req) + 1),
              c.store.getState().experiments.chunkRequests
                ? (t.fbIndex =
                    c.store
                      .getState()
                      .AAXReqs.filter(function(e) {
                        return (
                          -1 === e.bidReqID.indexOf('-') ||
                          '0' === e.bidReqID.split('-')[1]
                        )
                      })
                      .map(function(e) {
                        return e.bidReqID.split('-')[0]
                      })
                      .indexOf(e.split('-')[0]) + 1)
                : (t.fbIndex = t.index),
              t
            )
          }
          function Ze() {
            var e = rt(),
              t = []
            return e
              ? (Object.keys(c.store.getState().slotBids).forEach(function(r) {
                  'video' !== c.store.getState().slotBids[r][0].mediaType &&
                    c.store
                      .getState()
                      .slotBids[r].filter(function(e) {
                        return void 0 !== e.amzniid
                      })
                      .forEach(function(n) {
                        var o = { slotID: r, iid: n.amzniid, fid: n.bidReqID },
                          a = [],
                          i = []
                        if (
                          (r in e &&
                            ((a = e[r].fetchedAt.filter(function(e) {
                              return (
                                e.AAXReqInfo &&
                                e.AAXReqInfo.bidReqID === n.bidReqID
                              )
                            })),
                            (i = e[r].targetedAt.filter(function(e) {
                              return e.targeting === n.amzniid
                            }))),
                          a.length > 0
                            ? a.length > 0 &&
                              i.length >= a.length &&
                              a.slice(a.length - 1)[0].ts >
                                i.slice(a.length - 1)[0].ts
                              ? 1 ===
                                e[r].fetchWithIID.filter(function(e) {
                                  return e === n.amzniid
                                }).length
                                ? (o.state = 1)
                                : (o.state = 4)
                              : -1 !== e[r].fetchWithIID.indexOf(n.amzniid)
                              ? (o.state = 3)
                              : (o.state = 2)
                            : (o.state = 0),
                          1 === o.state || 2 === o.state)
                        ) {
                          var s = c.store
                              .getState()
                              .AAXReqs.filter(function(e) {
                                return e.bidReqID === n.bidReqID
                              })[0].resTs,
                            u = $e(s, e[r].fetchedAt, 2 === o.state)
                          u &&
                            (0, d.safeObjectHasProp)(u, 'ts') &&
                            (o.delta = s - u.ts)
                        }
                        t.push(o)
                      })
                }),
                t)
              : t
          }
          function $e(e, t, r) {
            return t[
              et(
                t.map(function(t) {
                  var n = e - t.ts
                  return r ? (n >= 0 ? n : null) : n <= 0 ? -n : null
                })
              )
            ]
          }
          function et(e) {
            for (var t, r, n, o = 0; o < e.length; o++)
              'number' == typeof (t = e[o]) &&
                ('number' != typeof n || t < r) &&
                ((n = o), (r = t))
            return n
          }
          function tt(e, t) {
            return c.store.getState().AAXReqs.filter(function(e) {
              return (
                e.bidConfig.slots
                  .map(function(e) {
                    return e.slotID
                  })
                  .indexOf(t) > -1
              )
            })[e]
          }
          function rt() {
            if (!O.hasAdServerObjectLoaded()) return null
            var e = c.store.getState().gamLog.reduce(function(e, t) {
              ;(0, d.safeObjectHasProp)(e, t.slotID) ||
                (e[t.slotID] = { fetchedAt: [], targetedAt: [] })
              var r = e[t.slotID]
              return (
                r.fetchedAt.push({
                  ts: t.ts,
                  AAXReqInfo: tt(r.fetchedAt.length, t.slotID),
                }),
                (0, d.safeObjectHasProp)(t.targeting, 'amzniid') &&
                (0, d.safeObjectHasProp)(t.targeting.amzniid, 0)
                  ? r.targetedAt.push({
                      ts: t.ts - 1,
                      targeting: t.targeting.amzniid[0],
                    })
                  : r.targetedAt.push({ ts: t.ts - 1, targeting: '' }),
                e
              )
            }, {})
            return (
              Object.keys(e).forEach(function(t) {
                var r = e[t]
                ;(r.fetchWithIID = r.fetchedAt.map(function(e) {
                  var t = $e(e.ts, r.targetedAt, !0)
                  return t ? t.targeting : 0
                })),
                  (e[t] = r)
              }),
              e
            )
          }
          function nt() {
            ot(), at()
          }
          function ot() {
            'http://' === u.PROTOCOL &&
              new i.default({
                run: it.bind(null, ['http', 'https']),
                cases: {
                  aax: [
                    'http://aax.amazon-adsystem.com/dtb-ping',
                    'https://aax.amazon-adsystem.com/dtb-ping',
                  ],
                  cf: [
                    'http://c.amazon-adsystem.com/aax2/dtb-ping.txt',
                    'https://c.amazon-adsystem.com/aax2/dtb-ping.txt',
                  ],
                },
                name: 'https',
                sample: 'EXPERIMENT_HTTPS',
              })
          }
          function at() {
            new i.default({
              run: it.bind(null, ['aax', 'cf']),
              cases: {
                tst: [
                  u.PROTOCOL + 'aax.amazon-adsystem.com/dtb-ping',
                  u.PROTOCOL + 'c.amazon-adsystem.com/dtb-ping',
                ],
              },
              name: 'edge-server',
              pixelTemplate: { env: u.PROTOCOL.replace(/[\W]/g, '') },
              sample: 'EXPERIMENT_EDGE',
            })
          }
          function it(e, t, r) {
            ;(r = st(r)),
              dt((0, d.shuffleArray)(r), function() {
                var n
                return t(
                  (v(
                    (n = {
                      pubID: c.store.getState().config
                        ? c.store.getState().config.pubID
                        : null,
                    }),
                    e[0],
                    ct(r[0])
                  ),
                  v(n, e[1], ct(r[1])),
                  n)
                )
              })
          }
          function st(e) {
            return e.map(function(e) {
              return (
                e +
                (-1 === e.indexOf('?') ? '?' : '&') +
                'cb=' +
                (0, d.getRand)()
              )
            })
          }
          function ct(e) {
            try {
              var t = (0, l.getResourcePerformanceObject)(window, e)
              return (
                (0, l.getMetricFromPerformanceObject)(t, 'responseEnd') -
                (0, l.getMetricFromPerformanceObject)(t, 'fetchStart')
              )
            } catch (e) {
              return (0, p.reportError)(e, '__getRoundTripTime-error__'), 0
            }
          }
          function dt(e, t) {
            var r = { requests: {}, callback: !1 }
            e.map(function(e) {
              r.requests[e] = !1
            })
            var n = function(e) {
              ;(r.requests[e] = !0), !r.callback && ut(r.requests) && t()
            }
            e.map(function(e) {
              ;(0,
              m.xhrGet)({ url: e, onload: n.bind(null, e), onerror: n.bind(null, e, !0) })
            })
          }
          function ut(e) {
            var t = Object.keys(e)
            return (
              t
                .map(function(t) {
                  return e[t]
                })
                .filter(function(e) {
                  return e
                }).length === t.length
            )
          }
          function lt() {
            O.hasAdServerObjectLoaded()
              ? Ge('noRequest')
              : O.isCommandQueueDefined() &&
                O.cmdQueuePush(function() {
                  Ge('noRequest')
                })
          }
          function ft(e) {
            return 'video' !== e.mediaType
          }
          function pt(e) {
            O.isCommandQueueDefined() &&
              (c.store.dispatch({
                type: 'REQUESTED_BID_FOR_ADSERVER_SLOTS',
                slotIDs: e,
              }),
              c.store.dispatch({
                type: 'REQUESTED_BID_FOR_PMP_ONLY_DFP_SLOTS',
                slotIDs: e,
              }),
              O.cmdQueuePush(function() {
                var t = ce()
                '0' === O.getTargeting('amznbid')[0] && Fe(),
                  se(
                    e,
                    t.map(function(e) {
                      return O.getSlotElementId(e)
                    })
                  )
                    ? t.forEach(function(t) {
                        ;(0, d.inArray)(e, O.getSlotElementId(t)) &&
                          !Ue(t) &&
                          Ge('bidInFlight', t)
                      })
                    : O.cmdQueuePush(function() {
                        Ge('bidInFlight')
                      })
              }))
          }
          function gt(e, t, r) {
            switch (e) {
              case 'getLog':
                return c.store.getState().eventLog
              case 'getState':
                return c.store.getState()
              case 'enable':
                return (
                  (0, d.setDebugMode)('fake_bids', !0), 'DEBUG MODE ENABLED'
                )
              case 'disable':
                return (
                  (0, d.setDebugMode)('fake_bids', !1), 'DEBUG MODE DISABLED'
                )
              case 'enableConsole':
                return (0, g.enableDebugConsole)(), 'Debug console enabled'
              case 'disableConsole':
                return (0, g.disableDebugConsole)(), 'Debug console disabled'
              case 'setDebug':
                return (0, d.setDebugMode)(t, r)
                  ? "Set debug mode '" + t + "' to '" + r + "'"
                  : "Failed to set debug mode '" + t + "'"
              default:
                return 'unknown debug argument'
            }
          }
          function mt() {
            return (
              window.AMP_CONTEXT_DATA &&
              'AMP-AD' === window.AMP_CONTEXT_DATA.tagName
            )
          }
          function _t(e) {
            return (
              (0, d.safeObjectHasProp)(e, 'type') &&
              'amp' === e.type &&
              !(e instanceof Document)
            )
          }
          function bt(e, t) {
            return ((0, d.safeObjectHasProp)(t, 'ampEnv') && t.ampEnv) || _t(e)
          }
          function St(e) {
            return e.split('x').map(function(e) {
              return parseInt(e, 10)
            })
          }
          function Et(e, t, r) {
            try {
              ;(0, f.sendPixels)()
            } catch (e) {
              ;(0, p.reportError)(e, '__sendPixels-renderImp__')
            }
            if (bt(e, r) && mt()) Te(e, r)
            else {
              var n = !1
              t &&
                'string' == typeof t &&
                0 === t.indexOf('sp|') &&
                ((t = t.substring(3)), (n = !0))
              var o,
                a = t || e.amzniid,
                i = le(a, n),
                s = i.slotBid,
                d = i.dealId
              if (
                ((o =
                  d && d.length >= 1
                    ? St('sp' === d ? s.amznsz_sp : fe(a, s, d))
                    : St(s.size)),
                1 !== arguments.length)
              )
                if (s) {
                  s.bidState === u.BID_STATES.rendered && Ke(s),
                    c.store.dispatch({
                      type: 'BID_STATE_CHANGE',
                      slotID: s.slotID,
                      bidID: t,
                      bidState: u.BID_STATES.rendered,
                      dealId: d,
                      ts: Date.now(),
                    }),
                    A.addTimer('imp')
                  var l = s.host,
                    g = 'amznad' + Math.round(1e6 * Math.random()),
                    _ = {
                      bidID: t,
                      doc: e,
                      pp: ht('amznbid', s, d),
                      host: l,
                      adID: g,
                      sizes: o,
                      amznp: ht('amznp', s, d),
                      crID: ht('crid', s, d),
                      fif: !1,
                      dealId: d,
                      isSharedPMP: n,
                      cfe: s.cfe,
                    }
                  '1' === s.fif
                    ? ((_.fif = '1'),
                      c.store.dispatch({
                        type: 'UPDATE_BID_INFO_PROP',
                        slotID: s.slotID,
                        iid: t,
                        key: 'doc',
                        value: e,
                        dealId: d,
                      }),
                      (0, m.loadScriptTag)(ye(_), null, document))
                    : c.store.getState().aaxViewabilityEnabled
                    ? vt(_, e)
                    : Ae(_),
                    je(e, o)
                } else
                  (0, p.reportError)(
                    new Error('Invalid bid ID tried to render'),
                    '__error-invalid_bid_id_render__'
                  )
              else De({ doc: s.doc, bidID: s.amzniid, sizes: o, html: e.html })
            }
          }
          function ht(e, t, r) {
            return r && r.length >= 1
              ? 'sp' === r
                ? t[e + '_sp']
                : ''
              : t[e]
              ? t[e]
              : ''
          }
          function vt(e, t) {
            var r = t.createElement('script')
            ;(r.type = 'text/javascript'),
              (r.async = !0),
              (e.viewabilityParams = {
                doc: t,
                bidID: e.bidID,
                states: {
                  csmLoaded: !1,
                  iframeLoaded: !1,
                  shouldRunViewability: !0,
                },
              })
            var n = we.bind(null, e.viewabilityParams)
            ;(0, m.addOnLoadFunction)(r, function() {
              ;(e.viewabilityParams.states.csmLoaded = !0), n()
            })
            try {
              r.onerror = function(e) {
                return (0, f.noBidCacheIdPixel)({
                  _type: 'csm_fail',
                  ts: Date.now(),
                  msg: e.message,
                })
              }
            } catch (e) {
              ;(0, p.reportError)(e, '__error-csm_onerror__')
            }
            Ae(e, n), (r.src = c.store.getState().cfg.CSM_JS), he(t, r)
          }
          function yt(e) {
            G(e),
              c.store.dispatch({ type: 'UPDATE_SLOT_BIDS', bids: ge(e) }),
              (0, d.safeObjectHasProp)(e, 'ev') &&
                c.store.dispatch({
                  type: 'SET_VIEWABILITY',
                  viewability: e.ev,
                }),
              (0, d.safeObjectHasProp)(e, 'cfn') &&
                c.store.dispatch({
                  type: 'SET_CFG',
                  cfg: {
                    CSM_JS:
                      '//' === e.cfn.substring(0, 2)
                        ? e.cfn
                        : '//c.amazon-adsystem.com/' + e.cfn,
                  },
                }),
              F(e)
          }
          function Ot() {
            return (
              'number' == typeof c.store.getState().cfg.MAX_SLOTS_PER_REQUEST &&
              c.store.getState().cfg.MAX_SLOTS_PER_REQUEST > 0
            )
          }
          function It(e, t) {
            var r = Pt.bind(null, e, t)
            void 0 === c.store.getState().gdpr ||
            null === c.store.getState().gdpr
              ? (c.store.dispatch({ type: 'ADD_GDPR_QUE_ITEM', func: r }),
                1 === c.store.getState().gdprQue.length &&
                  (0, s.GDPR)(c.store.getState().config.gdpr, Tt))
              : r()
          }
          function Tt(e) {
            c.store.dispatch({ type: 'SET_GDPR_CONFIG', config: e }),
              c.store.getState().gdprQue.map(function(e) {
                try {
                  e()
                } catch (e) {
                  ;(0, p.reportError)(e, '__gdpr_que__')
                }
              }),
              c.store.dispatch({ type: 'CLEAR_GDPR_QUE' })
          }
          function Dt(e) {
            return e
              .filter(function(e) {
                return 'fluid' !== e
              })
              .map(function(e) {
                return [e.getWidth(), e.getHeight()]
              })
          }
          function At(e) {
            var t = X().split('x')
            return {
              slotID: e.getSlotElementId(),
              slotName: e.getAdUnitPath(),
              sizes: Dt(e.getSizes(Number(t[0]), Number(t[1]))),
            }
          }
          function wt(e) {
            return e.filter(function(e) {
              return 0 !== e.sizes.length
            })
          }
          function Rt(e) {
            return (
              e || (e = ce()),
              wt(
                e.map(function(e) {
                  return At(e)
                })
              )
            )
          }
          function Pt(e, t) {
            var r = !1
            !0 === c.store.getState().config.simplerGPT &&
              (!(0, d.safeObjectHasProp)(e, 'slots') ||
                (e.slots.length > 0 &&
                  !(0, d.safeObjectHasProp)(e.slots[0], 'slotID'))) &&
              (0 === ce().length
                ? ((0, p.reportError)(
                    new Error(
                      'fetchBids was called in simplerGPT mode before any slots were defined in GPT'
                    ),
                    !0
                  ),
                  (r = !0),
                  (e.slots = []))
                : ((e.slots = Rt(e.slots)),
                  0 === e.slots.length &&
                    ((0, p.consoleWarn)(
                      new Error(
                        'No GPT slots provided to apstag.fetchBids() had valid sizes'
                      ),
                      !0
                    ),
                    (r = !0))))
            var n,
              o,
              a = zt(e.slots)
            a && (e.slots = a)
            try {
              ;(n = B(
                (n =
                  e.timeout ||
                  c.store.getState().config.bidTimeout ||
                  c.store.getState().cfg.DEFAULT_TIMEOUT)
              )) || (n = c.store.getState().cfg.DEFAULT_TIMEOUT),
                'function' != typeof t &&
                  (void 0 !== t &&
                    (0, p.reportError)(
                      new Error(
                        'Invalid callback function provided to apstag.fetchBids'
                      ),
                      '__error-invalid_callback_fetchbids_',
                      !0
                    ),
                  (t = function() {})),
                (e.bidReqID = (0, d.getRand)()),
                (t = K(Le(t, e), n))
            } catch (e) {
              ;(0, p.reportError)(e, '__error-fetchBids__')
            }
            if (0 === e.slots.length)
              return (
                !1 === r &&
                  (0, p.reportError)(
                    new Error('No slots provided to apstag.fetchBids'),
                    '__error-no_slots_provided_bid_request__',
                    !0
                  ),
                void setTimeout(t.bind(null, []), 10)
              )
            if (
              (pt(e.slots.filter(ft).map(Ne)),
              c.store.dispatch({
                type: 'NEW_FETCH_BID_REQUEST',
                fid: e.bidReqID,
                pto: n,
              }),
              c.store.dispatch({
                type: 'RECORD_ORIGINAL_BID_CONFIG',
                bidConfig: e,
              }),
              (0, d.isDebugEnabled)('fake_bids'))
            )
              Me(e, t)
            else if (u.HAS_XHR_SUPPORT)
              if (
                (c.store.dispatch({
                  type: 'SHOULD_CHUNK_REQUESTS',
                  value: (0, d.shouldSample)(
                    c.store.getState().cfg.CHUNK_BID_REQUESTS_PROPORTION
                  ),
                }),
                c.store.getState().experiments.chunkRequests && Ot())
              ) {
                o = Ct(e)
                for (var i = 0; i < o.length; i++)
                  o[i].bidReqID = e.bidReqID + '-' + i
                c.store.dispatch({
                  type: 'ADD_CHUNKED_REQUESTS',
                  fid: e.bidReqID,
                  numChunks: o.length,
                }),
                  o.forEach(function(e) {
                    H(W(e, n), t, e.bidReqID)
                  })
              } else H(W(e, n), t, e.bidReqID)
            else (0, m.loadScriptTag)(W(e, n), t)
          }
          function Ct(e) {
            for (
              var t = Math.ceil(
                  e.slots.length / c.store.getState().cfg.MAX_SLOTS_PER_REQUEST
                ),
                r = new Array(t),
                o = 0;
              o < t;
              o++
            ) {
              var a = o * c.store.getState().cfg.MAX_SLOTS_PER_REQUEST
              r[o] = {
                slots: e.slots.slice(
                  a,
                  a + c.store.getState().cfg.MAX_SLOTS_PER_REQUEST
                ),
              }
            }
            return r.map(function(t) {
              return n({}, e, t)
            })
          }
          function zt(e) {
            try {
              return e.map(function(e) {
                return e.sizes &&
                  (0, d.isArray)(e.sizes) &&
                  !(0, d.isArray)(e.sizes[0])
                  ? n({}, e, { sizes: [e.sizes] })
                  : e
              })
            } catch (e) {
              ;(0, p.reportError)(e, '__error-adjustSlotArraySizes__')
            }
            return !1
          }
          function Lt(e) {
            ;(e.punt = !0), G(e), F(e)
          }
          function jt(e) {
            ;(0, d.safeObjectHasProp)(c.store.getState().config, 'adServer')
              ? O.isSupported
                ? (Se(e), qe())
                : (0, p.reportError)(
                    new Error(
                      'apstag.setDisplayBids called with unsupported ad server: ' +
                        c.store.getState().config.adServer
                    ),
                    '__error-invalid_ad_server_setdisplaybids__',
                    !0
                  )
              : (0, p.reportError)(
                  new Error(
                    'apstag.setDisplayBids called without specifying ad server'
                  ),
                  '__error-no_ad_server_setdisplaybids__',
                  !0
                )
          }
          function Bt(e, t) {
            switch (e.adServer) {
              case 'appnexus':
                O = _.displayAdServerAppNexus
                break
              case 'googletag':
                O = b.displayAdServerGoogletag
                break
              case 'sas':
                O = E.displayAdServerSAS
                break
              default:
                O = S.displayAdServerDefault
            }
            var r = Z(e)
            lt(), 'success' === r && 'function' == typeof t && t()
          }
          function xt() {
            var e =
              arguments.length <= 0 || void 0 === arguments[0]
                ? 'display'
                : arguments[0]
            switch (e) {
              case 'display':
                return u.DISPLAY_TARGETING_KEYS
              case 'video':
                return u.VIDEO_TARGETING_KEYS
              default:
                return $() &&
                  (0, d.isArray)(c.store.getState().targetingKeys[e])
                  ? c.store.getState().targetingKeys[e]
                  : 'unknown targeting type ' + e
            }
          }
          function Mt(e, t) {
            var r = t
            return function() {
              return (
                z({ method: e, args: arguments }), r.apply(void 0, arguments)
              )
            }
          }
          function Nt(e, t) {
            return function() {
              try {
                return e.apply(void 0, arguments)
              } catch (e) {
                return (0, p.reportError)(e, t, !0), null
              }
            }
          }
          A.addTimer('tlt')
          try {
            ;(0, d.safeObjectHasProp)(window, 'apstag') &&
              (0, d.safeObjectHasProp)(window.apstag, '_Q') &&
              window.apstag._Q.length > 0 &&
              c.store.dispatch({ type: 'SET_Q', Q: window.apstag._Q })
          } catch (e) {
            ;(0, p.reportError)(e, '__error-storeApstagQ__')
          }
          ;(window.apstag = ((C = {
            punt: Lt,
            init: Bt,
            debug: gt,
            targetingKeys: xt,
            fetchBids: It,
            setDisplayBids: jt,
            renderImp: Et,
            bids: yt,
          }),
          r &&
            (Object.keys(C).forEach(function(e) {
              C[e] = Mt(e, C[e])
            }),
            (0, g.enableDebugConsole)(!0)),
          Object.keys(C).forEach(function(e) {
            C[e] = Nt(C[e], e)
          }),
          C)),
            (function() {
              try {
                c.store.dispatch({
                  type: 'SHOULD_CF_ROUTE',
                  value: (0, d.shouldSample)(
                    c.store.getState().cfg.CF_ROUTING_RATE
                  ),
                }),
                  c.store.getState().experiments.shouldCFRoute &&
                    c.store.dispatch({
                      type: 'SET_HOST',
                      hostName: 'DEFAULT_AAX_BID_HOST',
                      hostValue: 'c.amazon-adsystem.com',
                    }),
                  c.store.dispatch({
                    type: 'SHOULD_SAMPLE_LATENCY',
                    value: (0, d.shouldSample)(
                      c.store.getState().cfg.LATENCY_SAMPLING_RATE
                    ),
                  }),
                  c.store.getState().experiments.shouldSampleLatency &&
                    (Qe(), Xe(), Ye()),
                  nt()
              } catch (e) {
                ;(0, p.reportError)(e, '__error-sampleLatency__')
              }
              try {
                J()
              } catch (e) {
                ;(0, p.reportError)(e, '__error-doLast__')
              }
              if (!mt())
                try {
                  var e = {}
                  e.url = c.store.getState().cfg.CSM_RTB_COMMUNICATOR_JS
                  var t = function(e) {
                    ;(e && 'object' !== (void 0 === e ? 'undefined' : o(e))) ||
                      (e = 'Request Timeout or Error'),
                      (0, p.reportError)(
                        { message: 'csm-rtb-comm-js loading failed', name: e },
                        '__csm-rtb-comm-js__'
                      )
                  }
                  ;(e.onload = function(e) {
                    e.readyState === XMLHttpRequest.DONE && 200 === e.status
                      ? eval(e.responseText)
                      : t(
                          JSON.stringify({
                            status: e.statusText,
                            response: e.responseXML,
                          })
                        )
                  }),
                    (e.onerror = t),
                    (e.ontimeout = t),
                    (0, m.xhrGet)(e)
                } catch (e) {
                  ;(0, p.reportError)(e, '__load-csm-rtb-comm-js__')
                }
            })()
        })()
    } catch (e) {
      ;(0, p.reportError)(e, '__error-global__')
    }
  },
  function(e, t, r) {
    e.exports = r(14)
  },
])
//# sourceMappingURL=apstag.js.map
