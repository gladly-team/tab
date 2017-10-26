import {
  cyan500,
  white,
  darkBlack,
  fullBlack
} from 'material-ui/styles/colors'

import {fade} from 'material-ui/utils/colorManipulator'
import spacing from 'material-ui/styles/spacing'

// Logo color: #9d4ba3
// Color tool:
// https://material.io/color/#!/?view.left=0&view.right=0&primary.color=9d4ba3&secondary.color=FFEE58&secondary.text.color=757575
const primaryColor = '#9d4ba3'
const primaryColorDark = '#6c1b74'
const primaryColorLight = '#d07ad5'
const textOnPrimaryColor = '#FFFFFF'

export const alternateAccentColor = '#4a90e2'

// const secondaryColor = '#ffee58'
// const secondaryColorDark = '#c9bc1f'
// const secondaryColorLight = '#ffff8b'
// const textOnSecondaryColor = '#616161'

const textColor = '#212121'
export const lighterTextColor = 'rgba(33, 33, 33, 0.56)'
export const dividerColor = '#BDBDBD'

export default {
  spacing: spacing,
  fontFamily: '"Helvetica Neue", "Calibri Light", sans-serif',
  palette: {
    primary1Color: primaryColor,
    primary2Color: primaryColorDark,
    primary3Color: primaryColorLight,
    accent1Color: primaryColorLight,
    accent2Color: primaryColorLight,
    accent3Color: primaryColorLight,
    textColor: textColor,
    alternateTextColor: textOnPrimaryColor,
    canvasColor: white,
    borderColor: dividerColor,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  },
  fontIcon: {
    color: textColor,
    hoverColor: textColor
  },
  chip: {
    deleteIconColor: textColor
  },
  textField: {
    underlineColor: dividerColor,
    underlineFocusStyle: textColor
  }
}

export const dashboardIconInactiveColor = 'rgba(255, 255, 255, 0.8)'
export const dashboardIconActiveColor = white
