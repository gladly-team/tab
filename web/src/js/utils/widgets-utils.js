function getWidgetConfig(config, settings) {
  const configuration = {}
  var value
  var field
  for (var index in settings) {
    field = settings[index].field
    if (!config || !(field in config)) {
      value = settings[index].defaultValue
    } else {
      value = config[field]
    }
    configuration[field] = value
  }

  return configuration
}

export { getWidgetConfig }
