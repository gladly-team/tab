
var listToString = (list, separator) => {
  if (!list || !list.length) { return '' }
  var result = ''
  for (var i = 0; i < list.length - 1; i++) {
    result += list[i] + separator
  }
  result += list[list.length - 1]
  return result
}

export {
  listToString
}
