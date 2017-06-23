import {
  cyan500,
  white,
  darkBlack,
  fullBlack
} from 'material-ui/styles/colors'

import {fade} from 'material-ui/utils/colorManipulator'
import spacing from 'material-ui/styles/spacing'

const darkPrimaryColor = '#512DA8'
const defaultPrimaryColor = '#673AB7'
const lightPrimaryColor = '#D1C4E9'
const textPrimaryColor = '#FFFFFF'
const accentColor = '#7C4DFF'
const primaryTextColor = '#212121'
const dividerColor = '#BDBDBD'

export default {
  spacing: spacing,
  fontFamily: '"Helvetica Neue", "Calibri Light", Roboto, sans-serif',
  palette: {
    primary1Color: defaultPrimaryColor,
    primary2Color: darkPrimaryColor,
    primary3Color: lightPrimaryColor,
    accent1Color: accentColor,
    accent2Color: lightPrimaryColor,
    accent3Color: lightPrimaryColor,
    textColor: primaryTextColor,
    alternateTextColor: textPrimaryColor,
    canvasColor: white,
    borderColor: dividerColor,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  },
  fontIcon: {
    color: textPrimaryColor,
    hoverColor: textPrimaryColor
  },
  chip: {
    deleteIconColor: textPrimaryColor
  },
  textField: {
    underlineColor: dividerColor,
    underlineFocusStyle: textPrimaryColor
  }
}
