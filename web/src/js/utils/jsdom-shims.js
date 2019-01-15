// Workaround for getting element width and height.
// https://github.com/tmpvar/jsdom/issues/135#issuecomment-68191941
Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get: function() {
      return parseFloat(window.getComputedStyle(this).marginLeft) || 0
    },
  },
  offsetTop: {
    get: function() {
      return parseFloat(window.getComputedStyle(this).marginTop) || 0
    },
  },
  offsetHeight: {
    get: function() {
      return parseFloat(window.getComputedStyle(this).height) || 0
    },
  },
  offsetWidth: {
    get: function() {
      return parseFloat(window.getComputedStyle(this).width) || 0
    },
  },
})
